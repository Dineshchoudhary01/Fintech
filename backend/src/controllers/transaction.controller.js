const Transaction = require('../models/Transaction');
const Category = require('../models/Category');


async function createTransaction(req,res){
    try {
        const { amount, type , description, category , paymentMethod} = req.body;
        if(!amount || amount <= 0 ||  !type || !description || !category){
            return res.status(400).json( { msg: "Amount, type, description and category are required"});
        }

        const categoryExists = await Category.findById(category);
        if(!categoryExists){
            return res.status(404).json({ msg: "Category not found"});
        }

         const transaction = new Transaction({
          user: req.user._id,
          amount,
          type,
          description,
          category,
          categorySource: 'manual',
          paymentMethod
         });

         await transaction.save();

         res.status(201).json(transaction);

    } catch (error) {
        res.status(500).json({ msg: 'Failed to create transaction ', error:error.message});
    }
}

module.exports = { createTransaction };