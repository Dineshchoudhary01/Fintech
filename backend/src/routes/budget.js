const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { createBudget, getBudget } = require('../controllers/Budget.controller');


router.post('/',authMiddleware,createBudget);
router.get('/', authMiddleware,getBudget );

module.exports = router;