const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { createBudget } = require('../controllers/Budget.controller');


router.post('/',authMiddleware,createBudget);

module.exports = router;