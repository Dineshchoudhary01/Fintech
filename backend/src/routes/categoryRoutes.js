const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getCategories,createCategory,deleteCategory } = require('../controllers/Category.controller');


router.get('/', authMiddleware,getCategories);
router.post('/',authMiddleware,createCategory);
router.delete('/:id',authMiddleware, deleteCategory);

module.exports = router;