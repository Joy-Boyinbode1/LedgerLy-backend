import { Op } from 'sequelize';
import Sale from '../models/sales.model.js';
import Expense from '../models/expenses.model.js';
import Business from '../models/business.model.js';
import { generateInsights } from './ai.service.js';

const getAccountingInsights = async (userId, period = 'all-time') => {
  // 1️⃣ Find the user's business
  const business = await Business.findOne({ where: { userId } });
  if (!business) throw new Error('Business not found');

  // 2️⃣ Determine date range
  const now = new Date();
  let startDate, endDate;

  switch (period) {
    case 'daily':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      break;
    case 'weekly':
      const firstDayOfWeek = now.getDate() - now.getDay();
      startDate = new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek);
      endDate = new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek + 7);
      break;
    case 'monthly':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      break;
    default:
      startDate = new Date(0);
      endDate = now;
  }

  // 3️⃣ Fetch sales & expenses
  const sales = await Sale.findAll({
    where: { businessId: business.id, createdAt: { [Op.gte]: startDate, [Op.lt]: endDate } }
  });

  const expenses = await Expense.findAll({
    where: { businessId: business.id, createdAt: { [Op.gte]: startDate, [Op.lt]: endDate } }
  });
  //profit on products
  //profits on sales table profit at sale for each sale on the table
  //aggregate gross profit  - selling price at sale - cost price at sale for every sale made
  //profit margin on product (selling- cost price on producst)/selling price *100
  //profit margin on sales (sellingprice at Sale - cost price at sale) /selling price at sale *100
  //product revenue = sum of (selling price at sale *quantity)
  //aggregate product margin =  (agg gross profit/ product revenue )*100
  //total revenue = sum of all products revenue
  //total gross profit =sum of all aggregate products gross profit for all products
  //business level net profit = total gross profit - total expenses
  const totalSales = sales.reduce((sum, s) => {
    return sum + parseFloat(s.totalAmount || 0);
  }, 0);
  const totalExpenses = expenses.reduce((sum, e) => {
    return sum + parseFloat(e.amount || 0);
  }, 0);
  
  const grossProfit = totalSales - totalExpenses;


  const profitMargin = (grossProfit / totalSales) * 100;

let healthScore;
// net profitmargin = business net profit/total revenue * 100
// impact of expenses = (total expenses for a particular period / total product gross profit for that period of time) * 100

// if net profit > 0 =made profit this period
// if net profit < 0 =made loss this period

//product with highest profit = identify product with highest aggregate gross profit for a product

// expense ratio  > 0.3 if expenses > 0.3 your expenses are consuming 30% of your gross profit
// if expenses === total product gross profit => no net profit
if (profitMargin >= 30 && grossProfit > 0){
   healthScore = "Healthy";
}
else if (profitMargin > 10 && grossProfit > 0){
   healthScore = "Moderate";
}
else {
  healthScore = 'At Risk';
}


  // 4️⃣ Format financial data for AI
  const financialData = `
Total Revenue: ${totalSales}
Total Expenses: ${totalExpenses}
Gross Profit: ${grossProfit}
Sales Count: ${sales.length}
Expenses Count: ${expenses.length}
Profit Margin : ${profitMargin}
Health Score: ${healthScore}
`;

  // 5️⃣ Generate AI insights
  const aiInsights = await generateInsights(financialData);

  // 6️⃣ Return combined result
  return {
    period,
    totalSales,
    totalExpenses,
    grossProfit,
    profitMargin,
    salesCount: sales.length,
    expensesCount: expenses.length,
    aiInsights
  };
};
export {getAccountingInsights}