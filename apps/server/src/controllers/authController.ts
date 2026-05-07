import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/User.js";

function logAuth(event: string, details: Record<string, unknown>) {
  const ts = new Date().toISOString();
  // Never log secrets (passwords, JWTs). Keep logs structured + grep-friendly.
  console.info(`[auth] ${ts} ${event}`, details);
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET in environment.");
  return secret;
}

export async function register(req: Request, res: Response) {
  const startedAt = Date.now();
  const { email, password } = req.body as { email?: string; password?: string };
  logAuth("register:start", {
    email,
    ip: req.ip,
    ua: req.get("user-agent"),
  });
  if (!email || !password) {
    logAuth("register:bad_request", { email, ms: Date.now() - startedAt });
    return res.status(400).json({ message: "email and password are required" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    logAuth("register:conflict", { email, ms: Date.now() - startedAt });
    return res.status(409).json({ message: "email already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash });

  logAuth("register:success", { email: user.email, userId: user._id.toString(), ms: Date.now() - startedAt });
  return res.status(201).json({ id: user._id.toString(), email: user.email });
}

export async function login(req: Request, res: Response) {
  const startedAt = Date.now();
  const { email, password } = req.body as { email?: string; password?: string };
  logAuth("login:start", {
    email,
    ip: req.ip,
    ua: req.get("user-agent"),
  });
  if (!email || !password) {
    logAuth("login:bad_request", { email, ms: Date.now() - startedAt });
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    logAuth("login:invalid_email", { email, ms: Date.now() - startedAt });
    return res.status(401).json({ message: "invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    logAuth("login:invalid_password", { email, userId: user._id.toString(), ms: Date.now() - startedAt });
    return res.status(401).json({ message: "invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id.toString() }, getJwtSecret(), { expiresIn: "7d" });

  logAuth("login:success", { email, userId: user._id.toString(), ms: Date.now() - startedAt });
  return res.json({ token });
}
