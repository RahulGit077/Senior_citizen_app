
// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentcontroller');

// Create a new payment order
router.post('/create-order', paymentController.createOrder);

// Verify payment after success
router.post('/verify', paymentController.verifyPayment);

// Get single payment by ID
router.get('/:id',paymentController.getPaymentById);

// Get all payments (admin only)
router.get('/', paymentController.getAllPayments);

// Webhook handler for Razorpay events
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
