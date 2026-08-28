
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const route = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express()
const port = 3000

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', route);
app.use('/api/categories', categoryRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectDB().then(() => {
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
})
