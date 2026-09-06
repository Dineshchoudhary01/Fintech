const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { createTransaction, getTransaction } = require('../controllers/transaction.controller');


router.post('/', authMiddleware, createTransaction);
router.get('/', authMiddleware,getTransaction);

module.exports = router;