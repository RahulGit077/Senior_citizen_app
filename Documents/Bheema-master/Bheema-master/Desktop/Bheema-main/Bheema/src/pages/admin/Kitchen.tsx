import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, ChefHat, AlertTriangle, RefreshCw, Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// API url
const API_URL = "http://localhost:5000/api";

// Order status types based on backend model
type OrderStatus = "pending" | "preparing" | "ready" | "served" | "completed" | "cancelled";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderId: string;
  userId: string;
  customerName: string;
  tableNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  specialInstructions: string;
  createdAt: string;
  updatedAt: string;
  subtotal: number;
  serviceCharge: number;
  totalAmount: number;
  paymentStatus: "unpaid" | "paid";
  paymentMethod: "cash" | "card" | "upi" | "";
}

const Kitchen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchOrders();
    
    // Set up interval to refresh orders every 60 seconds
    const intervalId = setInterval(() => {
      fetchOrders(true);
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      if (silent) setRefreshing(true);
      
      const response = await axios.get(`${API_URL}/orders`);
      
      // Check if the response has the expected structure
      if (response.data && response.data.orders) {
        setOrders(response.data.orders);
      } else if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Received unexpected data format from server");
      }
      
      setError(null);
      
      if (silent) {
        toast({
          title: "Orders Updated",
          description: "Order list has been refreshed",
        });
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await axios.patch(`${API_URL}/orders/${orderId}/status`, { 
        status: newStatus 
      });
      
      // Update orders in state
      if (response.data && response.data.success) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.orderId === orderId ? { ...order, status: newStatus } : order
          )
        );
        
        toast({
          title: "Order Updated",
          description: `Order ${orderId} status changed to ${newStatus}`,
        });
      } else {
        throw new Error("API returned unsuccessful response");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      toast({
        title: "Update Failed",
        description: "Failed to update order status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus => {
    const statusFlow: Record<OrderStatus, OrderStatus> = {
      pending: "preparing",
      preparing: "ready",
      ready: "served",
      served: "completed",
      completed: "completed", // Terminal state
      cancelled: "cancelled"  // Terminal state
    };
    
    return statusFlow[currentStatus];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate time elapsed since order creation
  const getTimeElapsed = (createdAt: string) => {
    const orderTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const diffMinutes = Math.floor((currentTime - orderTime) / (1000 * 60));
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes === 1) return "1 minute ago";
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const hours = Math.floor(diffMinutes / 60);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  };

  // Filter orders by status
  const pendingOrders = orders.filter(order => order.status === "pending");
  const preparingOrders = orders.filter(order => order.status === "preparing");
  const readyOrders = orders.filter(order => order.status === "ready");
  const servedOrders = orders.filter(order => order.status === "served");
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full min-h-screen">
          <p className="text-lg">Loading orders...</p>
        </div>
      </AdminLayout>
    );
  }

  const renderOrderCard = (order: Order) => {
    const nextStatus = getNextStatus(order.status);
    const buttonText = {
      pending: "Start Preparing",
      preparing: "Mark as Ready",
      ready: "Mark as Served",
      served: "Complete Order",
    }[order.status] || "Update Status";
    
    // Calculate if order is taking too long
    const orderCreationTime = new Date(order.createdAt).getTime();
    const currentTime = new Date().getTime();
    const minutesElapsed = (currentTime - orderCreationTime) / (1000 * 60);
    
    // Different thresholds for different statuses
    const isDelayed = 
      (order.status === "pending" && minutesElapsed > 5) ||
      (order.status === "preparing" && minutesElapsed > 15) ||
      (order.status === "ready" && minutesElapsed > 5);
    
    return (
      <div 
        key={order.orderId} 
        className={`bg-white p-4 rounded-lg shadow-sm border ${
          isDelayed ? "border-red-200" : "border-green-100"
        }`}
      >
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="font-medium text-lg">{order.orderId}</span>
            <span className={`ml-3 ${isDelayed ? "text-red-500 font-medium" : "text-gray-500"}`}>
              {getTimeElapsed(order.createdAt)}
            </span>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
        
        <ul className="mb-3">
          {order.items.map((item, index) => (
            <li key={`${order.orderId}-item-${index}`} className="py-1 border-b border-gray-100 last:border-0">
              <div className="flex justify-between">
                <span>{item.quantity}x {item.name}</span>
                <span className="text-gray-600">₹{item.price.toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
        
        {order.specialInstructions && (
          <div className="bg-yellow-50 p-2 rounded mb-3 flex items-start gap-2">
            <AlertTriangle size={16} className="text-yellow-600 mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-700">{order.specialInstructions}</p>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm">
            <p>Customer: <span className="font-medium">{order.customerName}</span></p>
            <p>Table: <span className="font-medium">{order.tableNumber}</span></p>
            <p>Total: <span className="font-medium">₹{order.totalAmount.toFixed(2)}</span></p>
          </div>
          
          {order.status !== "completed" && order.status !== "cancelled" && (
            <Button 
              onClick={() => updateOrderStatus(order.orderId, nextStatus)} 
              className={`${
                isDelayed ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-800">Kitchen Dashboard</h1>
          <Button 
            onClick={() => fetchOrders()} 
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                Refresh Orders
              </>
            )}
          </Button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-6 flex items-center gap-2">
            <AlertTriangle size={18} />
            <p>{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchOrders()} 
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        )}
        
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="pending" className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex gap-2">
              <Clock size={18} />
              Pending ({pendingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="preparing" className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex gap-2">
              <ChefHat size={18} />
              Preparing ({preparingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="ready" className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex gap-2">
              <CheckCircle2 size={18} />
              Ready ({readyOrders.length})
            </TabsTrigger>
            <TabsTrigger value="served" className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex gap-2">
              <Utensils size={18} />
              Served ({servedOrders.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            {pendingOrders.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingOrders.map(renderOrderCard)}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">No pending orders at the moment</p>
            )}
          </TabsContent>
          
          <TabsContent value="preparing">
            {preparingOrders.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {preparingOrders.map(renderOrderCard)}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">No orders being prepared at the moment</p>
            )}
          </TabsContent>
          
          <TabsContent value="ready">
            {readyOrders.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {readyOrders.map(renderOrderCard)}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">No orders ready for delivery at the moment</p>
            )}
          </TabsContent>
          
          <TabsContent value="served">
            {servedOrders.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {servedOrders.map(renderOrderCard)}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">No served orders at the moment</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Kitchen;