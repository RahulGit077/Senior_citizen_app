//config/razorpay.js
const Razorpay = require('razorpay');
const dotenv = require("dotenv");
dotenv.config();
const razorpayInstance = new Razorpay({
  key_id: "rzp_test_0x82vBlNo6cnE4",
  key_secret: "xbieliyTKsT7PdMZM73Ona5Z"
});

module.exports = razorpayInstance;