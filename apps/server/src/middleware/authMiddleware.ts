import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type JwtPayload = { userId: string };

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET in environment.");
  return secret;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "missing token" });

  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;
    const authedReq = req as Request & { userId?: string };
    authedReq.userId = payload.userId;
    return next();
  } catch {
    return res.status(401).json({ message: "invalid token" });
  }
}
