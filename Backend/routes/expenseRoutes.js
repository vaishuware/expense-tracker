  
const express = require("express");
const router = express.Router();

const Expense = require("../models/Expense");

// GET - Get all transactions
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching transactions:", error);

    res.status(500).json({
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
});

// POST - Add transaction
router.post("/", async (req, res) => {
  try {
    const { title, amount, category, type } = req.body;

    const expense = new Expense({
      title,
      amount,
      category,
      type,
    });

    const savedExpense = await expense.save();

    res.status(201).json(savedExpense);
  } catch (error) {
    console.error("Error saving transaction:", error);

    res.status(500).json({
      message: "Failed to save transaction",
      error: error.message,
    });
  }
});

module.exports = router;

