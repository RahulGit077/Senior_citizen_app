import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import { Eye, Filter, Loader2, RefreshCw } from "lucide-react";
import axios from "axios";

// Backend API URL
const API_URL = "http://localhost:5000/api";

// Order type definition - aligned with backend model
interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderId: string; // Changed from orderNumber to orderId to match backend
  createdAt: string;
  status: "pending" | "preparing" | "ready" | "served" | "completed" | "cancelled";
  items: OrderItem[];
  subtotal: number;
  serviceCharge: number;
  totalAmount: number; // Changed from total to totalAmount to match backend
  customerName: string; // Changed from customer to customerName to match backend
  tableNumber: string;
  specialInstructions?: string;
  paymentStatus: string;
  paymentMethod: string;
  userId: string;
  updatedAt: string;
}

const OrdersAdmin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/orders`);
      
      // Check if the response has the expected format
      if (response.data && response.data.success) {
        setOrders(response.data.orders);
        setError(null);
        toast({
          title: "Orders loaded",
          description: `Successfully loaded ${response.data.count} orders`,
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };
  
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await axios.patch(`${API_URL}/orders/${orderId}/status`, { 
        status: newStatus 
      });
      
      if (!response.data || !response.data.success) {
        throw new Error("Failed to update status");
      }
      
      // Update the order in the local state
      setOrders(orders.map(order => 
        order.orderId === orderId ? { ...order, status: newStatus as Order["status"] } : order
      ));
      
      toast({
        title: "Status updated",
        description: `Order #${selectedOrder?.orderId} status updated to ${newStatus}`,
      });
      
      setSelectedOrder(null);
      
      // Refresh orders to get latest data from backend
      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      toast({
        title: "Update failed",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch = searchQuery === "" || 
                         order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">Orders Management</h1>
          <Button 
            onClick={fetchOrders} 
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh Orders
          </Button>
        </div>
        
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400" size={18} />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="served">Served</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative flex-grow">
            <Input
              type="search"
              placeholder="Search by order ID, customer, or table"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
              <p className="mt-2 text-gray-500">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-red-500">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={fetchOrders}
              >
                Retry
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.tableNumber}</TableCell>
                      <TableCell>{order.items.length} items</TableCell>
                      <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                          <Eye size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                      No orders found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      
      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>Order #{selectedOrder.orderId}</span>
                <OrderStatusBadge status={selectedOrder.status} />
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{selectedOrder.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Table Number</p>
                <p className="font-medium">{selectedOrder.tableNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
              </div>
            </div>
            
            {/* Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className="font-medium capitalize">{selectedOrder.paymentStatus}</p>
              </div>
              {selectedOrder.paymentMethod && (
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium capitalize">{selectedOrder.paymentMethod}</p>
                </div>
              )}
            </div>
            
            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Order Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder.items.map((item, index) => (
                    <TableRow key={item.productId || index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                      ₹{(item.quantity * item.price).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2} className="font-medium">Subtotal</TableCell>
                    <TableCell colSpan={2} className="text-right font-medium">
                      ₹{selectedOrder.subtotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2} className="font-medium">Service Charge</TableCell>
                    <TableCell colSpan={2} className="text-right font-medium">
                      ₹{selectedOrder.serviceCharge.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2} className="text-right font-bold">
                      Total
                    </TableCell>
                    <TableCell colSpan={2} className="text-right font-bold">
                      ₹{selectedOrder.totalAmount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            {/* Special Instructions */}
            {selectedOrder.specialInstructions && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Special Instructions</h3>
                <p className="bg-gray-50 p-3 rounded-md text-gray-700">
                  {selectedOrder.specialInstructions}
                </p>
              </div>
            )}
            
            {/* Status Update */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Update Status:</p>
                <Select onValueChange={(value) => handleUpdateStatus(selectedOrder.orderId, value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="served">Served</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default OrdersAdmin;