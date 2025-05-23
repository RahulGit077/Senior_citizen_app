// models/Payment.js

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
  },
  razorpay_payment_id: {
    type: String,
  },
  razorpay_signature: {
    type: String,
  },
  amount: {
    type: Number,
  },
  currency: {
    type: String,
    default: "INR"
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed'],
    default: 'created'
  },
}, {
  timestamps: true  // automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Payment', paymentSchema);
