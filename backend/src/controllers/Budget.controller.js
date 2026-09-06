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

module.exports = { createBudget };