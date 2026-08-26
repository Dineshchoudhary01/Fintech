const express = require('express')
const router = express.Router();
const { register, Login, Logout, refreshAccessToken} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', Login);
router.post('/logout', Logout);
router.post('/refresh', refreshAccessToken);

module.exports = router;