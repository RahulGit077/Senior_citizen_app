const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const OrderSchema = new Schema({
  orderId: {
    type: String,
    
  },
  userId: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  items: [OrderItemSchema],
  tableNumber: {
    type: String,
    required: true
  },
  specialInstructions: {
    type: String,
    default: ''
  },
  subtotal: {
    type: Number,
    required: true
  },
  serviceCharge: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', ''],
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before save
OrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate unique order ID
OrderSchema.pre('save', function(next) {
  if (!this.isNew) {
    return next();
  }
  
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Generate random part (3 digits)
  const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  // Format: ORD-YYMMDD-XXX (where XXX is a random number)
  this.orderId = `ORD-${year}${month}${day}-${randomPart}`;
  next();
});

module.exports = mongoose.model('Order', OrderSchema);