import express from 'express';
import * as SaleController from '../controllers/sales.controller.js';
import * as ExpenseController from '../controllers/expenses.controller.js';
import auth from '../middleware/auth.js';

const V2 = express.Router();

// ================= SALES ROUTES =================

// GET all sales
V2.get('/sales', auth, SaleController.findAllSales);

//GET user products
V2.get('/user-products', auth, SaleController.getUserProducts)
// POST create sale
V2.post('/sales', auth, SaleController.addSale);

// DELETE sale by id
V2.delete('/sales/:id', auth, SaleController.deleteSale);


// ================= EXPENSE ROUTES =================

// GET all expenses
V2.get('/expenses', auth, ExpenseController.findAllExpenses);

// POST create expense
V2.post('/expenses', auth, ExpenseController.addExpense);

// DELETE expense by id
V2.delete('/expenses/:id', auth,ExpenseController.deleteExpense);

export default  V2;