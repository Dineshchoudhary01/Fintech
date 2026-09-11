const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getBudgetInsights } = require('../controllers/advisor.controller');

router.get('/insights', authMiddleware, getBudgetInsights);

module.exports = router;