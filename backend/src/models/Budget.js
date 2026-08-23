const mongoose = require('mongoose');



const BudgetSchema = new mongoose.Schema({

   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
   },

   category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
   },

   monthlyLimit: {
    type: Number,
    required: true
   },

   month: {
    type: Date,
    required: true
   },

},{ timestamps: true});

BudgetSchema.index({ user: 1, category: 1, month: 1}, { unique: true});

module.exports = mongoose.model('Budget', BudgetSchema);