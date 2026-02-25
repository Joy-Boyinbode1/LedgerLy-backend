// models/index.js
const Business = require('./business.model');
const Products = require('./products.model');
const Sale = require('./sales.model');
const Expense = require('./expenses.model');
const User = require('./user.model');

Business.hasMany(Products, { foreignKey: 'businessId' });
Products.belongsTo(Business, { foreignKey: 'businessId' });

Business.hasMany(Sale, { foreignKey: 'businessId' });
Sale.belongsTo(Business, { foreignKey: 'businessId' });

Business.hasMany(Expense, { foreignKey: 'businessId' });
Expense.belongsTo(Business, { foreignKey: 'businessId' });

Business.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Business, { foreignKey: 'userId' });

module.exports = { Business, Products, Sale, Expense, User };