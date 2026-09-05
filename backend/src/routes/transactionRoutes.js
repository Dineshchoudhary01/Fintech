const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { createTransaction } = require('../controllers/transaction.controller');


router.post('/', authMiddleware, createTransaction);

module.exports = router;