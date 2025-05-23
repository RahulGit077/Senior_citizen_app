const mongoose = require('mongoose');
const Table = require('./models/Table');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Sample table data
const initialTables = [
  // Window Area - Top
  { 
    tableId: 'table-1', 
    number: '1', 
    status: 'available', 
    seats: 2, 
    position: { x: 10, y: 10 }, 
    type: 'square' 
  },
  { 
    tableId: 'table-2', 
    number: '2', 
    status: 'available', 
    seats: 2, 
    position: { x: 90, y: 10 }, 
    type: 'square' 
  },
  { 
    tableId: 'table-3', 
    number: '3', 
    status: 'occupied', 
    seats: 2, 
    position: { x: 170, y: 10 }, 
    type: 'square' 
  },
  { 
    tableId: 'table-4', 
    number: '4', 
    status: 'available', 
    seats: 2, 
    position: { x: 250, y: 10 }, 
    type: 'square' 
  },
  
  // Center Area
  { 
    tableId: 'table-5', 
    number: '5', 
    status: 'available', 
    seats: 4, 
    position: { x: 50, y: 80 }, 
    type: 'circle' 
  },
  { 
    tableId: 'table-6', 
    number: '6', 
    status: 'occupied', 
    seats: 4, 
    position: { x: 150, y: 80 }, 
    type: 'circle' 
  },
  { 
    tableId: 'table-7', 
    number: '7', 
    status: 'available', 
    seats: 4, 
    position: { x: 250, y: 80 }, 
    type: 'circle' 
  },
  
  // Bottom Area
  { 
    tableId: 'table-8', 
    number: '8', 
    status: 'reserved', 
    seats: 6, 
    position: { x: 80, y: 160 }, 
    type: 'rectangle' 
  },
  { 
    tableId: 'table-9', 
    number: '9', 
    status: 'available', 
    seats: 6, 
    position: { x: 220, y: 160 }, 
    type: 'rectangle' 
  },
  
  // Bar Area - Right
  { 
    tableId: 'table-b1', 
    number: 'B1', 
    status: 'available', 
    seats: 1, 
    position: { x: 330, y: 40 }, 
    type: 'square' 
  },
  { 
    tableId: 'table-b2', 
    number: 'B2', 
    status: 'available', 
    seats: 1, 
    position: { x: 330, y: 80 }, 
    type: 'square' 
  },
  { 
    tableId: 'table-b3', 
    number: 'B3', 
    status: 'occupied', 
    seats: 1, 
    position: { x: 330, y: 120 }, 
    type: 'square' 
  },
  { 
    tableId: 'table-b4', 
    number: 'B4', 
    status: 'available', 
    seats: 1, 
    position: { x: 330, y: 160 }, 
    type: 'square' 
  },
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/authDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Seed the database
const seedDatabase = async () => {
  try {
    // First, clear existing tables
    await Table.deleteMany({});
    console.log('Existing tables cleared');
    
    // Insert new tables
    const tables = await Table.insertMany(initialTables);
    console.log(`${tables.length} tables have been inserted`);
    
    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();