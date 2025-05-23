
import React from "react";
import { CheckCircle, Circle, Clock } from "lucide-react";

type OrderStatus = "pending" | "approved" | "preparing" | "ready" | "served" | "cancelled" | "completed";

interface OrderStatusTrackerProps {
  currentStatus: OrderStatus;
}

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ currentStatus }) => {
  const statuses = ["pending", "approved", "preparing", "ready", "served", "completed"];
  
  // Skip rendering for cancelled orders
  if (currentStatus === "cancelled") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
        <p className="text-red-700 text-center font-medium">This order has been cancelled</p>
      </div>
    );
  }

  if (currentStatus === "completed") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
        <p className="text-green-700 text-center font-medium">This order has been completed</p>
      </div>
    );
  }

  const getCurrentStep = () => {
    return statuses.indexOf(currentStatus);
  };

  const currentStep = getCurrentStep();

  return (
    <div className="py-6">
      <div className="flex items-center">
        {statuses.map((status, index) => (
          <React.Fragment key={status}>
            {/* Status circle */}
            <div className="relative flex flex-col items-center">
              <div
                className={`rounded-full transition duration-500 ease-in-out h-12 w-12 flex items-center justify-center ${
                  index <= currentStep
                    ? "bg-green-600 text-white"
                    : "bg-white border-2 border-gray-300 text-gray-400"
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-6 w-6" />
                ) : index === currentStep ? (
                  <Clock className="h-6 w-6" />
                ) : (
                  <Circle className="h-6 w-6" />
                )}
              </div>
              <div className="absolute top-14 text-center">
                <p
                  className={`text-xs font-medium uppercase ${
                    index <= currentStep ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </p>
              </div>
            </div>

            {/* Connector line */}
            {index < statuses.length - 1 && (
              <div
                className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
                  index < currentStep ? "border-green-600" : "border-gray-300"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusTracker;
