import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import OrderCard from "@/components/orders/OrderCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OrderStatusTracker from "@/components/orders/OrderStatusTracker";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import { getUserOrders, trackOrderById, formatOrderForDisplay } from "./api";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "./spinner";

// Demo user for hardcoded authentication
const DEMO_USER = {
  id: "user123",
  name: "Demo User",
  email: "demo@example.com"
};

// Order type definition
type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  orderNumber: string;
  date: Date;
  status: "pending" | "preparing" | "ready" | "served" | "completed" | "cancelled";
  items: OrderItem[];
  total: number;
  roomNumber: string;
  estimatedDelivery: Date | null;
  specialInstructions: string;
};

const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orderNumber, setOrderNumber] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState(false);
  
  // Fetch user orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const fetchedOrders = await getUserOrders(DEMO_USER.id);
        // Convert backend order format to frontend format
        const formattedOrders = fetchedOrders.map(formatOrderForDisplay);
        setOrders(formattedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast({
          title: "Error",
          description: "Failed to load your orders. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  
  // Track order by order number
  const handleSearch = async () => {
    if (!orderNumber.trim()) {
      toast({
        title: "Please enter an order number",
        description: "Enter your order number to track your order.",
        variant: "default",
      });
      return;
    }

    try {
      setTrackingOrder(true);
      // Construct the full order ID from the entered number
      // Assuming order numbers are formatted as: ORD-YYMMDD-XXX
      // And the user is entering just the XXX part
      const today = new Date();
      const year = today.getFullYear().toString().substr(-2);
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      
      // Try first with today's date
      let orderId = `ORD-${year}${month}${day}-${orderNumber.trim().padStart(3, '0')}`;
      
      try {
        const trackedOrder = await trackOrderById(orderId);
        const formattedOrder = formatOrderForDisplay(trackedOrder);
        setSelectedOrder(formattedOrder);
      } catch (error) {
        // If not found with today's date, try as a full order ID
        try {
          // If the user entered the complete order ID
          if (orderNumber.trim().startsWith('ORD-')) {
            const fullOrderId = orderNumber.trim();
            const trackedOrder = await trackOrderById(fullOrderId);
            const formattedOrder = formatOrderForDisplay(trackedOrder);
            setSelectedOrder(formattedOrder);
          } else {
            // If the order is not found
            toast({
              title: "Order not found",
              description: "We couldn't find an order with that number. Please check and try again.",
              variant: "destructive",
            });
          }
        } catch (innerError) {
          toast({
            title: "Order not found",
            description: "We couldn't find an order with that number. Please check and try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      toast({
        title: "Error",
        description: "Failed to track order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTrackingOrder(false);
    }
  };
  
  const handleViewOrderDetails = (id: string) => {
    const order = orders.find(o => o.id === id);
    if (order) {
      setSelectedOrder(order);
    }
  };
  
  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(order => {
        if (activeTab === "active") {
          return ["pending", "preparing", "ready", "served"].includes(order.status);
        } else if (activeTab === "completed") {
          return order.status === "completed";
        } else if (activeTab === "cancelled") {
          return order.status === "cancelled";
        }
        return false;
      });
  
  const formatTime = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8">My Orders</h1>
        
        {/* Order Tracking Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Track Your Order</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input 
              type="text"
              placeholder="Enter your order number" 
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="flex-grow"
              disabled={trackingOrder}
            />
            <Button 
              onClick={handleSearch} 
              className="whitespace-nowrap"
              disabled={trackingOrder}
            >
              {trackingOrder ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Tracking...
                </>
              ) : (
                "Track Order"
              )}
            </Button>
          </div>
        </div>
        
        {/* Orders List */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Spinner className="h-8 w-8" />
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    id={order.id}
                    orderNumber={order.orderNumber}
                    date={order.date}
                    status={order.status}
                    items={order.items}
                    total={order.total}
                    roomNumber={order.roomNumber}
                    onViewDetails={handleViewOrderDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-6">You haven't placed any orders in this category yet.</p>
                <Button asChild>
                  <a href="/menu">Browse Menu</a>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>Order #{selectedOrder.orderNumber}</span>
                <OrderStatusBadge status={selectedOrder.status} />
              </DialogTitle>
            </DialogHeader>
            
            {/* Order Status Tracker */}
            <div className="mb-4 pb-4 border-b">
              <OrderStatusTracker currentStatus={selectedOrder.status} />
            </div>
            
            {/* Order Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">{formatDate(selectedOrder.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estimated Delivery</p>
                  <p className="font-medium">
                    {selectedOrder.estimatedDelivery ? formatTime(selectedOrder.estimatedDelivery) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Location</p>
                  <p className="font-medium">Table {selectedOrder.roomNumber}</p>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Order Items</h3>
                <ul className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.quantity}x</span> {item.name}
                      </div>
                      <div className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between mt-4 pt-4 border-t font-bold">
                  <div>Total</div>
                  <div>₹{selectedOrder.total.toFixed(2)}</div>
                </div>
              </div>
              
              {/* Special Instructions */}
              {selectedOrder.specialInstructions && (
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Special Instructions</h3>
                  <p className="text-gray-700">{selectedOrder.specialInstructions}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default Orders;