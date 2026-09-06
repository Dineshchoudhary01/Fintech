const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { createTransaction, getTransaction,updateTransaction } = require('../controllers/transaction.controller');


router.post('/', authMiddleware, createTransaction);
router.get('/', authMiddleware,getTransaction);
router.put('/:id',authMiddleware,updateTransaction)

module.exports = router;