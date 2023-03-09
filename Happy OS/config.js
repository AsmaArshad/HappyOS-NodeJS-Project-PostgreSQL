// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  Secret_Key: process.env.Secret_Key,
  Port: process.env.Port
};