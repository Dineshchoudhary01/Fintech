const express = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { register, Login, Logout, refreshAccessToken, getProfile} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', Login);
router.post('/logout', Logout);
router.post('/refresh', refreshAccessToken);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;