
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectDB().then(() => {
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
})
