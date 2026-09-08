const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const { categorizeTransaction } = require('../services/aiServices');

async function createTransaction(req, res) {
  try {
    const { amount, type, description, paymentMethod } = req.body;
    let { category } = req.body;

    if (!amount || amount <= 0 || !type || !description) {
      return res.status(400).json({ msg: "Valid amount, type, and description are required" });
    }

    let categorySource = 'manual';

    if (!category) {
      // AI se predict karwao
      const userCategories = await Category.find({
        $or: [{ isDefault: true }, { user: req.user._id }]
      });
      const categoryNames = userCategories.map(c => c.name);

      const predictedName = await categorizeTransaction(description, categoryNames);

      const matchedCategory = userCategories.find(
        c => c.name.toLowerCase() === predictedName?.toLowerCase()
      );

      if (!matchedCategory) {
        return res.status(400).json({ msg: "Could not determine category, please specify manually" });
      }

      category = matchedCategory._id;
      categorySource = 'ai';
    } else {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ msg: "Category not found" });
      }
    }

    const transaction = new Transaction({
      user: req.user._id,
      amount,
      type,
      description,
      category,
      categorySource,
      paymentMethod
    });

    await transaction.save();
    res.status(201).json(transaction);

  } catch (error) {
    res.status(500).json({ msg: 'Failed to create transaction', error: error.message });
  }
}



async function getTransaction(req,res){
    try {
        const transactions = await Transaction.find({ user: req.user._id})
         .populate('category')
         .sort({ date: -1});

        res.status(200).json(transactions)
    } catch (error) {
        res.status(500).json({ msg: 'Failed to fetch transactions', error: error.message});
    }
}

async function updateTransaction(req,res){
    try {
        const transactionId = req.params.id;
        const transaction = await Transaction.findById(transactionId);
        if(!transaction){
            return res.status(404).json({ msg: "Transaction not found"});
        }

        if(transaction.user.toString() !== req.user._id.toString()){
            return res.status(403).json({ msg: "Not authorized to update this transaction"})
        }

       const { amount, type, description, category, paymentMethod} = req.body;

       if(amount !== undefined) transaction.amount = amount;
       if(type !== undefined) transaction.type = type;
       if(description !== undefined) transaction.description = description;
       if(category !== undefined) transaction.category = category;
       if(paymentMethod !== undefined) transaction.paymentMethod = paymentMethod;

       await transaction.save();
       res.status(200).json(transaction);

    } catch (error) {
        res.status(500).json({ msg: "Failed to update transaction", error: error.message});  
    }
}


async function deleteTransaction(req,res){
    try {
        const transactionId = req.params.id;
        const transaction = await Transaction.findById(transactionId);
        if(!transaction){
            return res.status(404).json({ msg: "transaction not found"});
        }

        if(transaction.user.toString() !== req.user._id.toString()){
            return res.status(403).json({ msg: "Not authorized to delete this transaction"});
        }

        await Transaction.deleteOne();
        res.status(200).json(transaction);

    } catch (error) {
        res.status(500).json({ msg: "Failed to delete transaction"});
    }
}







module.exports = { createTransaction,getTransaction,updateTransaction, deleteTransaction };