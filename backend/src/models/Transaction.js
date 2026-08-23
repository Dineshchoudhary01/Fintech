const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({

  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required: true  
  },

  amount : {
    type: Number,
    required: true
  },

  type : {
    type : String,
    enum: ['income', 'expense'],
    required: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },

  categorySource: {
    type: String,
    enum: ['manual','ai'],
    required: true
  },

  date: {
    type: Date,
    default: Date.now,
    required: true
  },

  paymentMethod: {
    type: String
  }


},{timestamps: true});

TransactionSchema.index({ user: 1, date: -1});

module.exports = mongoose.model('Transaction', TransactionSchema)