// components/PaymentDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const PaymentDetails = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const { data } = await axios.get(`/api/payments/${id}`);
        if (data.success) {
          setPayment(data.payment);
        } else {
          setError('Failed to fetch payment details');
        }
      } catch (err) {
        console.error(err);
        setError('Error loading payment details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaymentDetails();
  }, [id]);
  
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Loading payment details...</p>
      </div>
    );
  }
  
  if (error || !payment) {
    return (
      <div className="text-center py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Payment not found'}
        </div>
        <Link 
          to="/payments" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Payments
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payment Details</h2>
        <span className={`px-3 py-1 rounded-full text-sm ${
          payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
          payment.status === 'created' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {payment.status}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
          <div className="space-y-2">
            <div>
              <span className="text-gray-600">Amount:</span>
              <span className="ml-2 font-medium">{payment.amount} {payment.currency}</span>
            </div>
            <div>
              <span className="text-gray-600">Date:</span>
              <span className="ml-2 font-medium">{new Date(payment.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Razorpay Details</h3>
          <div className="space-y-2">
            <div className="break-all">
              <span className="text-gray-600">Order ID:</span>
              <span className="ml-2 font-medium">{payment.razorpay_order_id}</span>
            </div>
            <div className="break-all">
              <span className="text-gray-600">Payment ID:</span>
              <span className="ml-2 font-medium">{payment.razorpay_payment_id}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <Link 
          to="/payments" 
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
        >
          Back to Payments
        </Link>
      </div>
    </div>
  );
};

export default PaymentDetails;