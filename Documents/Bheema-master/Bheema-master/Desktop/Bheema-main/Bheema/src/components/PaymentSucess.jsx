import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const { paymentId, orderId, amount } = location.state || {};
  
  if (!paymentId) {
    return (
      <div className="text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">No payment information</h2>
          <p className="text-gray-600">Please make a payment first.</p>
        </div>
        <Link 
          to="/" 
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Make a Payment
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-4">Your transaction has been completed.</p>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-md mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Payment ID:</span>
          <span className="font-medium">{paymentId}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Order ID:</span>
          <span className="font-medium">{orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Amount:</span>
          <span className="font-medium">{amount} INR</span>
        </div>
      </div>
      
      <div className="flex space-x-4 justify-center">
        <Link 
          to="/" 
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Make Another Payment
        </Link>
        <Link 
          to={`/payments/${paymentId}`} 
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;