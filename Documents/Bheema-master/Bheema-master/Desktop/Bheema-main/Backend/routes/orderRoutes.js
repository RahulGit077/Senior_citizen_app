const express = require('express');
const orderRoutes = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
// POST /api/orders
orderRoutes.post('/', orderController.createOrder);

// Get all orders
// GET /api/orders
orderRoutes.get('/', orderController.getAllOrders);

// Get order by ID
// GET /api/orders/:orderId
orderRoutes.get('/:orderId', orderController.getOrderById);

// Get orders by user ID
// GET /api/orders/user/:userId
orderRoutes.get('/user/:userId', orderController.getUserOrders);

// Track order by ID
// GET /api/orders/:orderId/track
orderRoutes.get('/:orderId/track', orderController.trackOrderById);

// Update order status
// PATCH /api/orders/:orderId/status
orderRoutes.patch('/:orderId/status', orderController.updateOrderStatus);

module.exports = orderRoutes;