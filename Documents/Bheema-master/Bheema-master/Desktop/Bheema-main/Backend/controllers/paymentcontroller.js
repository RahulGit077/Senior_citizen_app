// controllers/paymentController.js
const razorpayInstance = require('../config/razorpay');
const crypto = require('crypto');
const Payment = require('../models/razorpay');

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR'} = req.body;
    console.log("hi");
    // Validate request
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required and must be greater than 0'
      });
    }
    
    // Create order in Razorpay
    const options = {
      amount: amount * 100, // amount in paisa
      currency,
      receipt: 'receipt_' + Date.now(),
      notes: {
        info: 'some note here'  // 👈 notes must be an object
      }
    };
    const order = await razorpayInstance.orders.create(options);
    console.log("hi");
    // Create a record in the database with status 'created'
    const payment = new Payment({
      razorpay_order_id: order.id,
      razorpay_payment_id: '', // Will be filled after payment
      razorpay_signature: '', // Will be filled after payment
      amount: amount,
      currency,
      status: 'created'
    });
    console.log("hi");
    await payment.save();
    
    // Return the order details to the client
    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      },
      key_id: "rzp_test_0x82vBlNo6cnE4" // For frontend initialization
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while creating the order'
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;
    
    // Validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification parameters'
      });
    }
    
    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', "xbieliyTKsT7PdMZM73Ona5Z")
      .update(body)
      .digest('hex');
    
    const isAuthentic = expectedSignature === razorpay_signature;
    
    if (isAuthentic) {
      // Find the payment record by order ID
      const payment = await Payment.findOne({ razorpay_order_id });
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment record not found'
        });
      }
      console.log("hi");
      console.log("verify");
      // Update payment record with payment details
      payment.razorpay_payment_id = razorpay_payment_id;
      payment.razorpay_signature = razorpay_signature;
      payment.status = 'paid';
      await payment.save();
      
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        payment: {
          id: payment._id,
          razorpay_order_id,
          razorpay_payment_id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status
        }
      });
    } else {
      // Update payment record to failed status
      await Payment.findOneAndUpdate(
        { razorpay_order_id },
        { status: 'failed' }
      );
      
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while verifying the payment'
    });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payment = await Payment.findById(id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching the payment'
    });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    console.log("all");
    return res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching payments'
    });
  }
};

// For webhook events from Razorpay
exports.handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    
    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');
    
    if (digest === signature) {
      // Process the webhook event
      const event = req.body.event;
      const payload = req.body.payload.payment.entity;
      
      switch (event) {
        case 'payment.authorized':
          // Payment is authorized but not captured yet
          break;
          
        case 'payment.captured':
          // Payment is successfully captured
          await Payment.findOneAndUpdate(
            { razorpay_payment_id: payload.id },
            { status: 'paid' }
          );
          break;
          
        case 'payment.failed':
          // Payment failed
          await Payment.findOneAndUpdate(
            { razorpay_payment_id: payload.id },
            { status: 'failed' }
          );
          break;
      }
      
      return res.status(200).json({ received: true });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong in webhook processing'
    });
  }
};