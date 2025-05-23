import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import axios from "axios";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Table {
  _id: string;
  tableId: string;
  number: string;
  status: "available" | "occupied" | "reserved";
  seats: number;
  position: { x: number; y: number };
  type: "circle" | "rectangle" | "square";
  currentOrderId?: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Demo user data - in a real app, this would come from authentication
const DEMO_USER = {
  id: "user123",
  name: "Demo User",
  email: "demo@example.com"
};

const Cart: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isTableSelectionOpen, setIsTableSelectionOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoadingTables, setIsLoadingTables] = useState(false);
  const [tableError, setTableError] = useState<string | null>(null);
  
  // Load cart items from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    
    // Add Razorpay script to the document
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  
  // Fetch tables from the API when the modal opens
  useEffect(() => {
    if (isTableSelectionOpen) {
      fetchTables();
    }
  }, [isTableSelectionOpen]);
  
  // Fetch tables from the API
  const fetchTables = async () => {
    try {
      setIsLoadingTables(true);
      setTableError(null);
      
      const response = await axios.get('/api/tables');
      
      if (response.data.success) {
        setTables(response.data.tables);
      } else {
        throw new Error('Failed to fetch tables');
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
      setTableError("Failed to load tables. Please try again.");
      
      toast({
        title: "Error loading tables",
        description: "There was a problem fetching available tables.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingTables(false);
    }
  };
  
  // Update localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  const handleQuantityChange = (id: string, change: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
    
    toast({
      title: "Quantity updated",
      description: "Your cart has been updated",
    });
  };
  
  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };
  
  const handleTableSelect = (table: Table) => {
    if (table.status === "available") {
      setSelectedTable(table.number);
      setIsTableSelectionOpen(false);
      
      toast({
        title: "Table selected",
        description: `You selected Table ${table.number}`,
      });
    } else {
      toast({
        title: "Table unavailable",
        description: "This table is not available. Please select another one.",
        variant: "destructive"
      });
    }
  };
  
  const handlePayment = async () => {
    if (!selectedTable) {
      toast({
        title: "Table required",
        description: "Please select a table before proceeding to payment",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsProcessingPayment(true);
      
      // Calculate order totals
      const subtotal = calculateSubtotal();
      const serviceCharge = subtotal * 0.15; // 15% service charge
      const total = subtotal + serviceCharge;
      
      // Create a payment order through your backend
      const response = await axios.post('/api/payments/create-order', {
        amount: total,
        currency: 'INR'
      });
      
      if (response.data.success) {
        const options: RazorpayOptions = {
          key: response.data.key_id,
          amount: response.data.order.amount,
          currency: response.data.order.currency,
          name: 'Restaurant App',
          description: 'Table Order Payment',
          order_id: response.data.order.id,
          handler: function (response) {
            // Verify payment on the backend
            verifyPayment(response);
          },
          prefill: {
            name: DEMO_USER.name,
            email: DEMO_USER.email,
          },
          theme: {
            color: '#3399cc'
          }
        };
        
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
        
        // Handle Razorpay modal close
        razorpayInstance.on('payment.failed', function (response: any) {
          toast({
            title: "Payment failed",
            description: response.error.description || "Payment process was canceled or failed",
            variant: "destructive"
          });
          setIsProcessingPayment(false);
        });
      } else {
        throw new Error('Failed to create payment order');
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      
      toast({
        title: "Payment initiation failed",
        description: "There was an error starting the payment process. Please try again.",
        variant: "destructive"
      });
      setIsProcessingPayment(false);
    }
  };
  
  const verifyPayment = async (paymentResponse: RazorpayResponse) => {
    try {
      // Verify payment with backend
      const verifyResponse = await axios.post('/api/payments/verify', {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature
      });
      
      if (verifyResponse.data.success) {
        toast({
          title: "Payment successful",
          description: "Your payment has been processed successfully",
        });
        
        // Proceed with order placement
        placeOrder(paymentResponse.razorpay_payment_id);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      
      toast({
        title: "Payment verification failed",
        description: "There was an error verifying your payment. Please contact support.",
        variant: "destructive"
      });
      setIsProcessingPayment(false);
    }
  };
  
  const placeOrder = async (paymentId: string) => {
    try {
      setIsSubmitting(true);
      
      // Calculate order totals
      const subtotal = calculateSubtotal();
      const serviceCharge = subtotal * 0.15; // 15% service charge
      const total = subtotal + serviceCharge;
      
      // Create order object to send to backend
      const orderData = {
        userId: DEMO_USER.id,
        customerName: DEMO_USER.name,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        tableNumber: selectedTable,
        specialInstructions,
        subtotal,
        serviceCharge,
        totalAmount: total,
        paymentId: paymentId, // Add the payment ID reference
        paymentStatus: 'paid' // Mark as paid since payment is verified
      };
      
      // Send order to backend API
      const response = await axios.post('/api/orders', orderData);
      
      // Handle successful order
      if (response.status === 201) {
        // Update table status to occupied
        try {
          await axios.patch(`/api/tables/${selectedTable}/status`, {
            status: 'occupied',
            currentOrderId: response.data.orderId
          });
        } catch (tableError) {
          console.error("Error updating table status:", tableError);
          // We continue anyway since the order was placed successfully
        }
        
        // Clear cart
        setCartItems([]);
        localStorage.removeItem('cart');
        
        toast({
          title: "Order placed successfully",
          description: `Order #${response.data.orderId} has been placed`,
        });
        
        // Navigate to order confirmation page
        navigate(`/orders`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      
      toast({
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setIsProcessingPayment(false);
    }
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  const subtotal = calculateSubtotal();
  const serviceCharge = subtotal * 0.15; // 15% service charge
  const total = subtotal + serviceCharge;

  const TableSelectionModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">Select Your Table</h3>
          <button 
            onClick={() => setIsTableSelectionOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <div className="text-center mb-2 text-sm font-medium">ENTRANCE</div>
          
          {isLoadingTables ? (
            <div className="flex items-center justify-center h-64 bg-white rounded border-2 border-dashed border-gray-300">
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <p className="text-sm text-gray-500">Loading tables...</p>
              </div>
            </div>
          ) : tableError ? (
            <div className="flex items-center justify-center h-64 bg-white rounded border-2 border-dashed border-gray-300">
              <div className="text-center space-y-2">
                <p className="text-red-500">{tableError}</p>
                <Button variant="outline" size="sm" onClick={fetchTables}>
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative h-64 border-2 border-dashed border-gray-300 rounded bg-white">
              {/* Tables */}
              {tables.map((table) => {
                // Determine table appearance based on type and status
                let tableClass = "absolute flex items-center justify-center text-sm transition-all";
                let tableStyle = {};
                
                if (table.type === "circle") {
                  tableClass += " rounded-full";
                  tableStyle = { 
                    left: `${table.position.x}px`, 
                    top: `${table.position.y}px`,
                    width: "50px", 
                    height: "50px" 
                  };
                } else if (table.type === "rectangle") {
                  tableClass += " rounded";
                  tableStyle = { 
                    left: `${table.position.x}px`, 
                    top: `${table.position.y}px`,
                    width: "80px", 
                    height: "40px" 
                  };
                } else {
                  tableClass += " rounded";
                  tableStyle = { 
                    left: `${table.position.x}px`, 
                    top: `${table.position.y}px`,
                    width: "40px", 
                    height: "40px" 
                  };
                }
                
                // Apply status-based styling
                if (table.status === "available") {
                  tableClass += " bg-green-100 border border-green-500 cursor-pointer hover:bg-green-200";
                  if (selectedTable === table.number) {
                    tableClass += " ring-2 ring-offset-2 ring-green-600 bg-green-300";
                  }
                } else if (table.status === "occupied") {
                  tableClass += " bg-red-100 border border-red-500 text-red-700 cursor-not-allowed";
                } else if (table.status === "reserved") {
                  tableClass += " bg-yellow-100 border border-yellow-500 text-yellow-700 cursor-not-allowed";
                }
                
                return (
                  <div
                    key={table.tableId}
                    className={tableClass}
                    style={tableStyle}
                    onClick={() => handleTableSelect(table)}
                  >
                    {table.number}
                  </div>
                );
              })}
              
              {/* Bar area */}
              <div 
                className="absolute bg-gray-300 rounded"
                style={{ right: "10px", top: "30px", height: "150px", width: "20px" }}
              >
                <div className="transform -rotate-90 whitespace-nowrap text-xs mt-16">BAR</div>
              </div>
              
              {/* Windows */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-blue-100 opacity-50"></div>
            </div>
          )}
          
          <div className="flex justify-center mt-4 space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 border border-green-500 rounded mr-1"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-100 border border-red-500 rounded mr-1"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-500 rounded mr-1"></div>
              <span>Reserved</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setIsTableSelectionOpen(false)}>
            Cancel
          </Button>
          <Button 
            disabled={!selectedTable || isLoadingTables}
            onClick={() => setIsTableSelectionOpen(false)}
          >
            Confirm Table {selectedTable}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8">Your Cart</h1>
        
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-medium mb-4">Cart Items</h2>
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item.id} className="py-6 flex">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-gray-900 font-medium">₹{item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between">
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              type="button"
                              className="p-1 text-gray-600 hover:text-gray-900"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-2 py-1 text-gray-900 min-w-[30px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="p-1 text-gray-600 hover:text-gray-900"
                              onClick={() => handleQuantityChange(item.id, 1)}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium mb-4">Special Instructions</h2>
                <Textarea 
                  placeholder="Add any special instructions or dietary requirements here..."
                  className="mb-4"
                  rows={3}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium">₹{subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Service Charge (15%)</p>
                    <p className="font-medium">₹{serviceCharge.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-4">
                    <p className="font-semibold">Total</p>
                    <p className="font-bold">₹{total.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Table Selection
                    </label>
                    <div 
                      className="flex justify-between items-center border border-gray-300 rounded p-2 cursor-pointer hover:bg-gray-50"
                      onClick={() => setIsTableSelectionOpen(true)}
                    >
                      {selectedTable ? (
                        <span>Table {selectedTable}</span>
                      ) : (
                        <span className="text-gray-500">Select a table</span>
                      )}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handlePayment} 
                    className="w-full mb-3"
                    disabled={isProcessingPayment || isSubmitting || cartItems.length === 0 || !selectedTable}
                  >
                    {isProcessingPayment ? "Processing Payment..." : "Proceed to Payment"}
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/menu">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Button asChild>
              <Link to="/menu">Browse Menu</Link>
            </Button>
          </div>
        )}
      </div>
      
      {isTableSelectionOpen && <TableSelectionModal />}
    </Layout>
  );
};

export default Cart;