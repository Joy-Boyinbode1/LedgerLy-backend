import Expense from '../models/expenses.model.js';
import Business from '../models/business.model.js';

// Add expense
const addExpense = async (req, res) => {
  try {
    const { description, amount,category } = req.body;
    const userId = req.user.id;

    if (!amount || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const expenseDescription = description || `Expense for ${category}`;


    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }

    // Find the user's business
    const business = await Business.findOne({ where: { userId } });
    if (!business) {
      return res.status(404).json({ message: 'Business not found for this user' });
    }
    const expense = await Expense.create({
      category,
      description: expenseDescription,
      amount,
      businessId: business.id
      
      
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
};

// Get all expenses (optionally per user)
const findAllExpenses = async (req, res) => {
  try {
    const { userId } = req.query;

    const whereClause = userId ? { userId } : {};

    const expenses = await Expense.findAll({ where: whereClause });

    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve expenses' });
  }
};

// Delete expense by ID
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Expense.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};

export {
  addExpense,
  findAllExpenses,
  deleteExpense
};
