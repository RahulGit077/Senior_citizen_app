
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OrderStatusBadge from "./OrderStatusBadge";
import { formatDistanceToNow } from "date-fns";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderCardProps {
  id: string;
  orderNumber: string;
  date: Date;
  status: "pending" | "approved" | "preparing" | "ready" | "delivered" | "cancelled";
  items: OrderItem[];
  total: number;
  roomNumber?: string;
  onViewDetails: (id: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  id,
  orderNumber,
  date,
  status,
  items,
  total,
  roomNumber,
  onViewDetails
}) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-green-100">
      <CardHeader className="bg-green-50 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Order #{orderNumber}</p>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(date, { addSuffix: true })}
            </p>
          </div>
          <OrderStatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-1">
          {items.slice(0, 2).map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span className="text-gray-600">₹{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
          {items.length > 2 && (
            <li className="text-sm text-gray-500">
              + {items.length - 2} more item(s)
            </li>
          )}
        </ul>
        {roomNumber && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Delivery to:</span> Table {roomNumber}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t bg-green-50">
        <div className="font-semibold">₹{total.toFixed(2)}</div>
        <Button variant="outline" onClick={() => onViewDetails(id)} className="text-green-700 border-green-200 hover:bg-green-50">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
