const Order = require('../models/Order');
const Table = require('../models/Table');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      customerName,
      items,
      tableNumber,
      specialInstructions,
      subtotal,
      serviceCharge,
      totalAmount
    } = req.body;

    // Validate required fields
    if (!userId || !customerName || !items || !tableNumber || !subtotal || !serviceCharge || !totalAmount) {
        console.error('Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if items array is not empty
    if (!items.length) {
        console.error('Order must contain at least one item');
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Find the table and check if it's available
    const table = await Table.findOne({ number: tableNumber });

    if (!table) {
        
        console.error('Table not found');
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    if (table.status !== 'available') {
        console.error('This table is not available');
      return res.status(400).json({
        success: false,
        message: 'This table is not available'
      });
    }

    // Create new order
    const newOrder = new Order({
      userId,
      customerName,
      items,
      tableNumber,
      specialInstructions,
      subtotal,
      serviceCharge,
      totalAmount
    });

    // Save the order
    const savedOrder = await newOrder.save();

    // Update the table status
    table.status = 'occupied';
    table.currentOrderId = savedOrder.orderId;
    await table.save();

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId: savedOrder.orderId,
      order: savedOrder
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};




// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Error getting all orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get orders by user ID
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Error getting user orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error getting order by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and status are required'
      });
    }
    
    // Check if status is valid
    const validStatuses = ['pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update order status
    order.status = status;
    await order.save();
    
    // If order is completed or cancelled, update table status
    if (status === 'completed' || status === 'cancelled') {
      const table = await Table.findOne({ number: order.tableNumber });
      if (table && table.currentOrderId === orderId) {
        table.status = 'available';
        table.currentOrderId = null;
        await table.save();
      }
    }
    
    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Track order by ID
exports.trackOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }
    
    // Find the order
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Get the table associated with the order
    const table = await Table.findOne({ number: order.tableNumber });
    
    // Return order with tracking information
    return res.status(200).json({
      success: true,
      order: {
        orderId: order.orderId,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.items,
        tableNumber: order.tableNumber,
        customerName: order.customerName,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        specialInstructions: order.specialInstructions,
        tableDetails: table ? {
          status: table.status,
          type: table.type,
          seats: table.seats
        } : null
      }
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};