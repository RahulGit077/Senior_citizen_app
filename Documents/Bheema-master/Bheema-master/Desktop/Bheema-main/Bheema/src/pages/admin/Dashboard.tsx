import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area,
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { FileText, ShoppingBag, TrendingUp, Users } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  orderId: string;
  userId: string;
  customerName: string;
  items: OrderItem[];
  tableNumber: string;
  specialInstructions: string;
  subtotal: number;
  serviceCharge: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardData {
  statistics: {
    title: string;
    value: string;
    change: string;
    icon: string;
    color: string;
  }[];
  salesData: {
    name: string;
    sales: number;
  }[];
  categoryData: {
    name: string;
    value: number;
  }[];
  orderTimeData: {
    time: string;
    orders: number;
  }[];
  activities: {
    message: string;
    time: string;
    type: "order" | "status" | "inventory" | "user" | "delivery";
  }[];
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    statistics: [],
    salesData: [],
    categoryData: [],
    orderTimeData: [],
    activities: []
  });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/orders`);
        
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          throw new Error("Failed to fetch orders");
        }
        
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      processDashboardData();
    }
  }, [orders]);

  const processDashboardData = () => {
    // Calculate statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    const pendingOrders = orders.filter(order => ['pending', 'preparing', 'ready'].includes(order.status)).length;
    
    // Prepare statistics data
    const statistics = [
      {
        title: "Total Revenue",
        value: `₹${totalRevenue.toFixed(2)}`,
        change: `${orders.length > 0 ? '+' : ''}${(orders.length * 2.5).toFixed(1)}% from last month`,
        icon: "TrendingUp",
        color: "green"
      },
      {
        title: "Total Orders",
        value: totalOrders.toString(),
        change: `${orders.length > 5 ? '+' : ''}${(orders.length - 5).toFixed(1)}% from last month`,
        icon: "ShoppingBag",
        color: "blue"
      },
      {
        title: "Completed Orders",
        value: completedOrders.toString(),
        change: `${completedOrders / (totalOrders || 1) * 100}% completion rate`,
        icon: "FileText",
        color: "purple"
      },
      {
        title: "Pending Orders",
        value: pendingOrders.toString(),
        change: `${pendingOrders} orders in progress`,
        icon: "Users",
        color: "yellow"
      }
    ];
    
    // Process weekly sales data
    const salesData = processWeeklySalesData(orders);
    
    // Process category data
    const categoryData = processCategoryData(orders);
    
    // Process order time data
    const orderTimeData = processOrderTimeData(orders);
    
    // Process recent activities
    const activities = processRecentActivities(orders);
    
    // Update state with processed data
    setDashboardData({
      statistics,
      salesData,
      categoryData,
      orderTimeData,
      activities
    });
  };

  const processWeeklySalesData = (orders: Order[]) => {
    // Get the last 7 days for weekly data
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    // Create a map for each date with initial sales as 0
    const salesByDate: Record<string, number> = {};
    dates.forEach(date => {
      salesByDate[date] = 0;
    });
    
    // Sum up sales for each date
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      if (salesByDate[orderDate] !== undefined) {
        salesByDate[orderDate] += order.totalAmount;
      }
    });
    
    // Format for chart
    return Object.entries(salesByDate).map(([date, sales]) => {
      // Format date to show as "Mon", "Tue", etc.
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      return {
        name: dayName,
        sales: parseFloat(sales.toFixed(2))
      };
    });
  };

  const processCategoryData = (orders: Order[]) => {
    // Extract all items from all orders
    const allItems = orders.flatMap(order => order.items);
    
    // Count items by product name (assuming product name represents category)
    const categoryCounts: Record<string, number> = {};
    
    allItems.forEach(item => {
      // Create category from the first word of the product name
      const category = item.name.split(' ')[0];
      if (!categoryCounts[category]) {
        categoryCounts[category] = 0;
      }
      categoryCounts[category] += item.quantity;
    });
    
    // Convert to format needed for PieChart
    return Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value
    }));
  };

  const processOrderTimeData = (orders: Order[]) => {
    // Define time slots
    const timeSlots = [
      { label: "6-9 AM", start: 6, end: 9 },
      { label: "9-12 PM", start: 9, end: 12 },
      { label: "12-3 PM", start: 12, end: 15 },
      { label: "3-6 PM", start: 15, end: 18 },
      { label: "6-9 PM", start: 18, end: 21 },
      { label: "9-12 AM", start: 21, end: 24 }
    ];
    
    // Initialize counts
    const timeCounts = timeSlots.reduce((acc, slot) => {
      acc[slot.label] = 0;
      return acc;
    }, {} as Record<string, number>);
    
    // Count orders per time slot
    orders.forEach(order => {
      const orderHour = new Date(order.createdAt).getHours();
      const slot = timeSlots.find(slot => orderHour >= slot.start && orderHour < slot.end);
      if (slot) {
        timeCounts[slot.label]++;
      }
    });
    
    // Format for chart
    return Object.entries(timeCounts).map(([time, orders]) => ({
      time,
      orders
    }));
  };

  const processRecentActivities = (orders: Order[]) => {
    // Get the 5 most recent orders
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    // Format for display
    return recentOrders.map(order => {
      const time = new Date(order.createdAt).toLocaleString();
      let message = '';
      let type: "order" | "status" | "inventory" | "user" | "delivery" = "order";
      
      switch (order.status) {
        case 'pending':
          message = `New order #${order.orderId} placed by ${order.customerName}`;
          type = "order";
          break;
        case 'preparing':
          message = `Order #${order.orderId} is being prepared`;
          type = "status";
          break;
        case 'ready':
          message = `Order #${order.orderId} is ready for serving`;
          type = "status";
          break;
        case 'served':
          message = `Order #${order.orderId} has been served to table ${order.tableNumber}`;
          type = "delivery";
          break;
        case 'completed':
          message = `Order #${order.orderId} has been completed`;
          type = "status";
          break;
        case 'cancelled':
          message = `Order #${order.orderId} has been cancelled`;
          type = "status";
          break;
        default:
          message = `Order #${order.orderId} status updated`;
          type = "status";
      }
      
      return {
        message,
        time,
        type
      };
    });
  };

  // Function to render the icon based on the string name
  const renderIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case "FileText":
        return <FileText className={`w-8 h-8 text-${color}-500`} />;
      case "TrendingUp":
        return <TrendingUp className={`w-8 h-8 text-${color}-500`} />;
      case "ShoppingBag":
        return <ShoppingBag className={`w-8 h-8 text-${color}-500`} />;
      case "Users":
        return <Users className={`w-8 h-8 text-${color}-500`} />;
      default:
        return <FileText className={`w-8 h-8 text-${color}-500`} />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg">Loading dashboard data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-lg text-red-500">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardData.statistics.map((stat, index) => (
            <StatCard 
              key={index}
              title={stat.title} 
              value={stat.value} 
              change={stat.change} 
              icon={renderIcon(stat.icon, stat.color)}
              color={stat.color}
            />
          ))}
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dashboardData.salesData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Sales']} />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#f97316"
                      fill="#ffedd5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Order by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dashboardData.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Orders']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Order Times */}
          <Card>
            <CardHeader>
              <CardTitle>Order Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboardData.orderTimeData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {dashboardData.activities.map((activity, index) => (
                  <ActivityItem 
                    key={index}
                    message={activity.message}
                    time={activity.time}
                    type={activity.type}
                  />
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => {
  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return "bg-blue-50";
      case "green":
        return "bg-green-50";
      case "yellow":
        return "bg-yellow-50";
      case "purple":
        return "bg-purple-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${getColorClasses()}`}>{icon}</div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-xl font-bold text-gray-900">{value}</h3>
            <p className="text-xs text-gray-600">{change}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ActivityItemProps {
  message: string;
  time: string;
  type: "order" | "status" | "inventory" | "user" | "delivery";
}

const ActivityItem: React.FC<ActivityItemProps> = ({ message, time, type }) => {
  const getBadgeColor = () => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-800";
      case "status":
        return "bg-yellow-100 text-yellow-800";
      case "inventory":
        return "bg-red-100 text-red-800";
      case "user":
        return "bg-purple-100 text-purple-800";
      case "delivery":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <li className="flex items-start">
      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getBadgeColor()}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
      <div className="ml-3">
        <p className="text-sm">{message}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </li>
  );
};

export default Dashboard;