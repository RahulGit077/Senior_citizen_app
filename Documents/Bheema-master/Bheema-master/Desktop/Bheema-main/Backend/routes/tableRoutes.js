const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

// Get all tables
// GET /api/tables
router.get('/', tableController.getAllTables);

// Get table by ID or number
// GET /api/tables/:tableId
router.get('/:tableId', tableController.getTableById);

// Create a new table
// POST /api/tables
router.post('/', tableController.createTable);

// Update table status
// PATCH /api/tables/:tableId/status
router.patch('/:tableId/status', tableController.updateTableStatus);

// Delete a table
// DELETE /api/tables/:tableId
router.delete('/:tableId', tableController.deleteTable);

module.exports = router;