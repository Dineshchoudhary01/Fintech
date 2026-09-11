const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');
const { createTransaction, getTransaction,updateTransaction,deleteTransaction,uploadTransactionsCSV } = require('../controllers/transaction.controller');


router.post('/', authMiddleware, createTransaction);
router.get('/', authMiddleware,getTransaction);
router.put('/:id',authMiddleware,updateTransaction)
router.delete('/:id', authMiddleware, deleteTransaction)
router.post('/upload-csv', authMiddleware, upload.single('file'), uploadTransactionsCSV);

module.exports = router;