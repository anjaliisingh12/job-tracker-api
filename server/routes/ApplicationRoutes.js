const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const auth = require("../middlewares/authMiddleware");

// CREATE
router.post("/", auth, async (req, res) => {
  try {
    const newApp = new Application({
      ...req.body,
      user: req.user,
    });

    await newApp.save();
    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL (Only logged in user data)
router.get("/", auth, async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedApp = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedApp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Application deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;