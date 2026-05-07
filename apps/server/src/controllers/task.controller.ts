import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Task } from "../models/task.model.js";

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function getTasks(_req: Request, res: Response) {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
}

export async function createTask(req: Request, res: Response) {
  try {
    const { title, description } = req.body as { title?: string; description?: string };

    if (!title?.trim()) {
      return res.status(400).json({ message: "title is required" });
    }

    const task = await Task.create({ title, description });
    return res.status(201).json(task);
  } catch {
    return res.status(500).json({ message: "Failed to create task" });
  }
}

export async function updateTask(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const { title, description, completed } = req.body as {
      title?: string;
      description?: string;
      completed?: boolean;
    };

    const task = await Task.findByIdAndUpdate(
      id,
      { title, description, completed },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json(task);
  } catch {
    return res.status(500).json({ message: "Failed to update task" });
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json({ message: "Task deleted" });
  } catch {
    return res.status(500).json({ message: "Failed to delete task" });
  }
}
