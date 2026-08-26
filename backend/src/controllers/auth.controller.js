 const jwt = require('jsonwebtoken');
 const User = require('../models/User');
 const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');


 async function register(req,res){
   try {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({ msg: "Name, email and password are required"});
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(409).json({ msg: "email already registered"})
    }

    const user = new User({name,email,password});

    const accessToken =  generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
        accessToken,
        user: { id: user._id, name: user.name, email: user.email } 
    });
   } catch (error) {
      res.status(500).json({ msg: 'Registration failed', error: error.message});
   }

 }

 async function Login(req,res) {

  try {
    const {email,password } = req.body;

    if(!email || !password){
        return res.status(400).json({ msg: 'email and password required'})
    }

    const user = await User.findOne({email}).select('+password');
    if(!user){
        return res.status(401).json({ msg: 'Invalid email '})
    }

    const ismatch = await user.comparePassword(password);
     if(!ismatch){
        return res.status(401).json({ msg: 'Invalid password'})
     }

     
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;   // ← ye line add karo
await user.save();  
    
     res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
        accessToken,
        user: { id: user._id, name: user.name, email: user.email } 
    });

  } catch (error) {
     res.status(500).json({ msg: 'login failed', error: error.message});
  }
 }

  async function Logout(req,res){
    try {
        const refreshToken = req.cookies.refreshToken;

        if(refreshToken){
            await User.findOneAndUpdate(
                 { refreshToken },
                 { refreshToken: null}
            );
        }
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.status(200).json({ msg: 'logout successfully'});
    } catch (error) {
        res.status(500).json({ msg: 'logout failed', error: error.message});
    }
  }

  async function refreshAccessToken(req,res){
   try {
     
    const refreshToken = req.cookies.refreshToken;
     console.log('1. Cookie se mila token:', refreshToken);

    
    if(!refreshToken){
        return res.status(401).json({ msg: 'refreshToken not found'})
    }
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
     console.log('2. Decoded:', decoded);

     
    const user = await User.findById( decoded.id).select('+refreshToken');
   console.log('3. User mila:', user);

    

    if(!user){
        return res.status(403).json({ msg: 'Invalid refresh token'});
    }
   
    if(user.refreshToken !== refreshToken){
        return res.status(403).json({ msg: 'Invalid refresh token'});
    }

    const accessToken = generateAccessToken(user._id);

    res.status(200).json({ accessToken });

   } catch (error) {
     return res.status(403).json({ msg: 'Invalid or expired refresh token'});
   }

  }

 

 module.exports = { register, Login, Logout, refreshAccessToken};