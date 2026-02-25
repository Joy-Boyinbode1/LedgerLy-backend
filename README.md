# LedgerLy Backend API  
### Women Techsters Fellowship – Capstone Project  

LedgerLy Backend powers a mobile financial management application designed for retail SME owners in Nigeria.  

It provides automated financial calculations, secure data storage, and AI-powered business insights that translate complex numbers into simple, actionable explanations.

---

## 🚀 Project Overview

LedgerLy helps small business owners:

- Track sales and expenses
- Monitor profitability in real time
- Analyze product performance
- Understand business health through AI-generated explanations

The backend handles all core logic, data processing, and analytics so the mobile app delivers clear financial insights to non-expert users.

---

## 🧠 Core Responsibilities

The API is responsible for:

- ✅ Sales logging
- ✅ Expense tracking
- ✅ Product management
- ✅ Profit & margin calculations
- ✅ Business insights aggregation
- ✅ AI-generated financial interpretation
- ✅ Authentication & authorization

---

## 🏗 Tech Stack

- **Node.js**
- **Express.js**
- **Sequelize ORM**
- **MySQL / PostgreSQL**
- **JWT Authentication**
- **AI Integration (LLM for financial explanations)**

---

## 📦 Key Models

### 🔹 Business
Represents a registered SME.

### 🔹 Product
Stores product inventory and pricing.

### 🔹 Sale
Tracks:
- productId
- quantitySold
- costPriceAtSale
- sellingPriceAtSale
- profitAtSale

### 🔹 Expense
Tracks categorized business expenses such as:
- Transportation
- Rent
- Electricity
- Utilities
- Salaries
- Marketing
- Tax
- Miscellaneous

---

## 📊 Insights Engine

The `/insights` endpoint aggregates:

- Total Revenue
- Total Expenses
- Net Profit
- Profit Margin
- Top-performing products
- Financial health summaries

It then generates AI-powered, plain-language interpretations such as:

> “Your perfume sales are driving most of your profit. Consider restocking this product to increase revenue.”

This ensures business owners understand their performance without needing accounting expertise.

---

## 🔐 Authentication

LedgerLy uses JWT-based authentication.

Protected routes require a valid token:

