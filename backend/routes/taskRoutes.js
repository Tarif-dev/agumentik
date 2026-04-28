import express from "express";
import Task from "../models/Task.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper to emit events to user's room
const emitUpdate = (req, event, data) => {
  const io = req.app.get("io");
  if (io) {
    io.to(req.user.toString()).emit(event, data);
  }
};

// CREATE
router.post("/", protect, async (req, res) => {
  const task = await Task.create({
    ...req.body,
    user: req.user,
  });
  emitUpdate(req, "task_created", task);
  res.json(task);
});

// GET ALL
router.get("/", protect, async (req, res) => {
  const tasks = await Task.find({ user: req.user });
  res.json(tasks);
});

// UPDATE
router.put("/:id", protect, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  emitUpdate(req, "task_updated", task);
  res.json(task);
});

// DELETE
router.delete("/:id", protect, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  emitUpdate(req, "task_deleted", req.params.id);
  res.json({ msg: "Deleted" });
});

export default router;
