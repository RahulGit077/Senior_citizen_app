
import React from 'react';

type OrderStatus = 'pending' | 'approved' | 'preparing' | 'ready' | 'served' | 'cancelled'|'completed';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const getStatusClasses = () => {
    switch (status) {
      case 'pending':
        return 'status-badge status-pending';
      case 'approved':
        return 'status-badge bg-blue-100 text-blue-800';
      case 'preparing':
        return 'status-badge status-preparing';
      case 'ready':
        return 'status-badge status-ready';
      case 'served':
        return 'status-badge status-delivered';
      case 'cancelled':
        return 'status-badge status-cancelled';
      case 'completed':
        return 'status-badge bg-green-100 text-green-800';
      default:
        return 'status-badge bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pending Approval';
      case 'approved':
        return 'Approved';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready for Delivery';
      case 'served':
        return 'Served';
      case 'cancelled':
        return 'Cancelled';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown Status';
    }
  };

  return <span className={getStatusClasses()}>{getStatusText()}</span>;
};

export default OrderStatusBadge;
