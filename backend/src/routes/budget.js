const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { createBudget, getBudget,updateBudget, deleteBudget } = require('../controllers/Budget.controller');


router.post('/',authMiddleware,createBudget);
router.get('/', authMiddleware,getBudget );
router.put('/:id', authMiddleware, updateBudget);
router.delete('/:id', authMiddleware, deleteBudget);

module.exports = router;