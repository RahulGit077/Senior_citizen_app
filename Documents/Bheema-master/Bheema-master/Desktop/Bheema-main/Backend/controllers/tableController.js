const Table = require('../models/Table');

// Get all tables
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ number: 1 });
    
    return res.status(200).json({
      success: true,
      count: tables.length,
      tables
    });
    
  } catch (error) {
    console.error('Error fetching tables:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get table by ID or number
exports.getTableById = async (req, res) => {
  try {
    const { tableId } = req.params;
    
    // Find by tableId or number
    const table = await Table.findOne({ 
      $or: [{ tableId }, { number: tableId }]
    });
    
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      table
    });
    
  } catch (error) {
    console.error('Error fetching table:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update table status
exports.updateTableStatus = async (req, res) => {
  try {
    const { tableId } = req.params;
    const { status, currentOrderId } = req.body;
    
    // Validate status
    const validStatuses = ['available', 'occupied', 'reserved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const table = await Table.findOne({ 
      $or: [{ tableId }, { number: tableId }]
    });
    
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }
    
    // Update table status
    table.status = status;
    
    // If provided, update currentOrderId
    if (currentOrderId !== undefined) {
      table.currentOrderId = currentOrderId;
    }
    
    const updatedTable = await table.save();
    
    return res.status(200).json({
      success: true,
      message: 'Table status updated successfully',
      table: updatedTable
    });
    
  } catch (error) {
    console.error('Error updating table status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create a new table
exports.createTable = async (req, res) => {
  try {
    const {
      number,
      seats,
      type,
      position,
      status
    } = req.body;
    
    // Check if table with same number already exists
    const existingTable = await Table.findOne({ number });
    if (existingTable) {
      return res.status(400).json({
        success: false,
        message: 'A table with this number already exists'
      });
    }
    
    // Create tableId
    const tableId = `table-${number}`;
    
    // Create new table
    const newTable = new Table({
      tableId,
      number,
      seats,
      type: type || 'square',
      position,
      status: status || 'available'
    });
    
    // Save the table
    const savedTable = await newTable.save();
    
    return res.status(201).json({
      success: true,
      message: 'Table created successfully',
      table: savedTable
    });
    
  } catch (error) {
    console.error('Error creating table:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete a table
exports.deleteTable = async (req, res) => {
  try {
    const { tableId } = req.params;
    
    const table = await Table.findOne({ 
      $or: [{ tableId }, { number: tableId }]
    });
    
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }
    
    // Check if table is occupied
    if (table.status === 'occupied') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete an occupied table'
      });
    }
    
    await Table.deleteOne({ _id: table._id });
    
    return res.status(200).json({
      success: true,
      message: 'Table deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting table:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};