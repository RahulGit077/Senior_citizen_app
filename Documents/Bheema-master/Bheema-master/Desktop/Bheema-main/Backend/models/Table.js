const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TableSchema = new Schema({
  tableId: {
    type: String,
    required: true,
    unique: true
  },
  number: {
    type: String,
    required: true,
    unique: true
  },
  seats: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved'],
    default: 'available'
  },
  type: {
    type: String,
    enum: ['circle', 'rectangle', 'square'],
    default: 'square'
  },
  position: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    }
  },
  currentOrderId: {
    type: String,
    default: null
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Update the lastUpdated field before save
TableSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('Table', TableSchema);