const express = require("express");
const paymentRoutes = require('./routes/paymentroutes');
// Register routes

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require('./routes/orderRoutes');
const tableRoutes = require('./routes/tableRoutes');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const cors = require("cors");
app.use(cors({ origin: "*", credentials: true }));


app.use(express.json());
app.use("/api/auth", authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
const Statistics = mongoose.model('Statistics', new mongoose.Schema({
  title: String,
  value: String,
  change: String,
  icon: String,
  color: String,
  updatedAt: { type: Date, default: Date.now }
}));


const SalesData = mongoose.model('SalesData', new mongoose.Schema({
  name: String,
  sales: Number,
  updatedAt: { type: Date, default: Date.now }
}));

const CategoryData = mongoose.model('CategoryData', new mongoose.Schema({
  name: String,
  value: Number,
  updatedAt: { type: Date, default: Date.now }
}));

const OrderTimeData = mongoose.model('OrderTimeData', new mongoose.Schema({
  time: String,
  orders: Number,
  updatedAt: { type: Date, default: Date.now }
}));

const Activity = mongoose.model('Activity', new mongoose.Schema({
  message: String,
  time: String,
  type: String,
  createdAt: { type: Date, default: Date.now }
}));

// Routes
// Get all dashboard data
app.get('/api/dashboard', async (req, res) => {
  try {
    const statistics = await Statistics.find().sort({ updatedAt: -1 });
    const salesData = await SalesData.find().sort('name');
    const categoryData = await CategoryData.find();
    const orderTimeData = await OrderTimeData.find().sort('time');
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      statistics,
      salesData,
      categoryData,
      orderTimeData,
      activities
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Statistics
app.post('/api/statistics', async (req, res) => {
  try {
    const newStat = new Statistics(req.body);
    const savedStat = await newStat.save();
    res.status(201).json(savedStat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add Sales Data
app.post('/api/sales', async (req, res) => {
  try {
    const newSales = new SalesData(req.body);
    const savedSales = await newSales.save();
    res.status(201).json(savedSales);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add Category Data
app.post('/api/categories', async (req, res) => {
  try {
    const newCategory = new CategoryData(req.body);
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add Order Time Data
app.post('/api/ordertimes', async (req, res) => {
  try {
    const newOrderTime = new OrderTimeData(req.body);
    const savedOrderTime = await newOrderTime.save();
    res.status(201).json(savedOrderTime);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add Activity
app.post('/api/activities', async (req, res) => {
  try {
    const newActivity = new Activity(req.body);
    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Seeds route to populate initial data
app.post('/api/seed', async (req, res) => {
  try {
    // Clear existing data
    await Statistics.deleteMany({});
    await SalesData.deleteMany({});
    await CategoryData.deleteMany({});
    await OrderTimeData.deleteMany({});
    await Activity.deleteMany({});

    // Seed statistics
    await Statistics.insertMany([
      { 
        title: "Total Orders", 
        value: "348", 
        change: "+12% from last week", 
        icon: "FileText", 
        color: "blue" 
      },
      { 
        title: "Revenue", 
        value: "₹12,643", 
        change: "+8% from last week", 
        icon: "TrendingUp", 
        color: "green" 
      },
      { 
        title: "Menu Items", 
        value: "124", 
        change: "+3 new items", 
        icon: "ShoppingBag", 
        color: "yellow" 
      },
      { 
        title: "Users", 
        value: "42", 
        change: "+5 new users", 
        icon: "Users", 
        color: "purple" 
      }
    ]);

    // Seed sales data
    await SalesData.insertMany([
      { name: "Mon", sales: 2400 },
      { name: "Tue", sales: 1398 },
      { name: "Wed", sales: 9800 },
      { name: "Thu", sales: 3908 },
      { name: "Fri", sales: 4800 },
      { name: "Sat", sales: 3800 },
      { name: "Sun", sales: 4300 }
    ]);

    // Seed category data
    await CategoryData.insertMany([
      { name: "Main Course", value: 45 },
      { name: "Appetizers", value: 25 },
      { name: "Desserts", value: 15 },
      { name: "Beverages", value: 15 }
    ]);

    // Seed order time data
    await OrderTimeData.insertMany([
      { time: "6-9 AM", orders: 15 },
      { time: "9-12 PM", orders: 25 },
      { time: "12-3 PM", orders: 45 },
      { time: "3-6 PM", orders: 30 },
      { time: "6-9 PM", orders: 50 },
      { time: "9-12 AM", orders: 20 }
    ]);

    // Seed activities
    await Activity.insertMany([
      {
        message: "New order #12345 received from Room 304",
        time: "10 minutes ago",
        type: "order"
      },
      {
        message: "Order #12343 status changed to Ready for Delivery",
        time: "35 minutes ago",
        type: "status"
      },
      {
        message: "Grilled Salmon stock is running low",
        time: "1 hour ago",
        type: "inventory"
      },
      {
        message: "New user registered: John Smith",
        time: "2 hours ago",
        type: "user"
      },
      {
        message: "Order #12341 has been delivered successfully",
        time: "3 hours ago",
        type: "delivery"
      }
    ]);

    res.status(200).json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ message: 'Error seeding database' });
  }
});



mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
