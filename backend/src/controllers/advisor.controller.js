const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Category = require('../models/Category');
const { generateBudgetAdvice } = require('../services/aiServices');



async function getBudgetInsights(req,res){
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(),1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth()+1,0);

       const spending = await Transaction.aggregate([
          {
            $match: {
                user: req.user._id,
                type: 'expense',
                date: { $gte: startOfMonth, $lte: endOfMonth}
            }
          },
           
          {
            $group: {
                _id: '$category',
                totalSpent: { $sum: '$amount' }
            }
          }
       ]);

        const budgets = await Budget.find({
      user: req.user._id,
      month: { $gte: startOfMonth, $lte: endOfMonth }
    }).populate('category');


        const summary = await Promise.all(
            budgets.map(async (budget) => {
                const matchedSpending = spending.find(
                 (s) => s._id?.toString() === budget.category._id.toString()
                );
           
                const spent = matchedSpending ? matchedSpending.totalSpent : 0;

                return {
                    category: budget.category.name,
                    budgetLimit: budget.monthlyLimit,
                    spent: spent,
                    remaining: budget.monthlyLimit - spent,
                    percentageUsed: Math.round((spent / budget.monthlyLimit) * 100)
                };
            })
        );

   const advice = await generateBudgetAdvice(summary);

   res.status(200).json({
    summary,
    advice
   });

    } catch (error) {
        res.status(500).json({ msg: "Failed to generate budget insights", error: error.message});
    }
}