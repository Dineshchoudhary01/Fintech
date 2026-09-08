const Budget = require('../models/Budget');

const Category = require('../models/Category');

async function createBudget(req,res){
    try {
         const { category, monthlyLimit, month} = req.body;
         if(!category || !monthlyLimit || monthlyLimit <= 0 ||  !month){
            return res.status(400).json({ msg: "Category, montly limit and month are required"});
         }

         const CategoryEixst = await Category.findById(category);
         if(!CategoryEixst){
            return res.status(404).json({ msg: "category not found"});
         }

         const budget = new Budget({
            user: req.user._id,
            category,
            monthlyLimit,
            month
         });

         await budget.save();
         res.status(201).json(budget);
    } catch (error) {
        if(error.code === 11000){
            return res.status(409).json({ msg: "Budget alerady exists for this category and month"});
        }
        res.status(500).json({ msg: 'Failed to create budget', error:error.message});
    }
}

async function getBudget(req,res){
    try {
        const budget = await Budget.find({ user: req.user._id})
        .populate('category')
        .sort({ month : -1});  

        res.status(200).json(budget);
    } catch (error) {
         res.status(500).json({ msg: "Failed to fetch budgets", error: error.message});
    }
}

async function updateBudget(req,res){
    try {
        const budgetId = req.params.id;
        const budget = await Budget.findById(budgetId);
        if(!budget){
            return res.status(404).json({ msg: "Budget not found"});
        }

        if(budget.user.toString() !== req.user._id.toString()){
            return res.status(403).json({ msg: "Not Authorized to update budget"});
        }

        const {  category,monthlyLimit,month} = req.body;

         if(category !== undefined) budget.category = category;
         if(monthlyLimit !== undefined) budget.monthlyLimit = monthlyLimit;
         if(month !== undefined) budget.month = month;

         await budget.save();

         res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ msg: "Failed to update budget", error:error.message});
    }
}

    async function deleteBudget(req,res){
        try {
            const budgetId = req.params.id;
            const budget = await Budget.findById(budgetId);
            if(!budget){
                return res.status(404).json({ msg: "Budget Not Found"});
            }

            if(budget.user.toString() !== req.user._id.toString()){
                return res.status(403).json({ msg: "Not Authorized to delete budget"});
            }

            await budget.deleteOne();
            res.status(200).json(budget);
        } catch (error) {
            res.status(500).json({ msg: "Failed to delete budget", error: error.message });
        }
    }

module.exports = { createBudget, getBudget,updateBudget,deleteBudget};