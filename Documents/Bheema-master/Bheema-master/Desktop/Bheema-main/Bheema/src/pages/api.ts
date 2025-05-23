// API utility functions for orders

const API_BASE_URL = 'http://localhost:5000/api';

// Get all orders for a user
export const getUserOrders = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }
    
    return data.orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Track order by ID
export const trackOrderById = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/track`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to track order');
    }
    
    return data.order;
  } catch (error) {
    console.error('Error tracking order:', error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch order');
    }
    
    return data.order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Format order data for frontend display
export const formatOrderForDisplay = (order) => {
  // Map backend order model to frontend display model
  return {
    id: order.orderId,
    orderNumber: order.orderId.split('-')[2], // Get the XXX part from ORD-YYMMDD-XXX
    date: new Date(order.createdAt),
    status: order.status,
    items: order.items.map(item => ({
      id: item._id || item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    })),
    total: order.totalAmount,
    roomNumber: order.tableNumber,
    estimatedDelivery: getEstimatedDeliveryTime(order),
    specialInstructions: order.specialInstructions || ''
  };
};

// Helper function to calculate estimated delivery time based on order status
function getEstimatedDeliveryTime(order) {
  const orderDate = new Date(order.createdAt);
  
  // Different statuses have different estimated times
  switch (order.status) {
    case 'pending':
      return new Date(orderDate.getTime() + 45 * 60 * 1000); // 45 minutes from order time
    case 'preparing':
      return new Date(orderDate.getTime() + 30 * 60 * 1000); // 30 minutes from order time
    case 'ready':
      return new Date(orderDate.getTime() + 10 * 60 * 1000); // 10 minutes from order time
    case 'served':
    case 'completed':
      return new Date(order.updatedAt); // Actual delivery time
    case 'cancelled':
      return null; // No delivery for cancelled orders
    default:
      return new Date(orderDate.getTime() + 45 * 60 * 1000); // Default 45 minutes
  }
}