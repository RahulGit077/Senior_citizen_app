import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchPayments = async () => {
      try {
  
        const response = await fetch('http://localhost:5000/api/payments');
        const data = await response.json();
        if (response.ok && data.success) {
          setPayments(data.payments);
        } else {
          setError('Failed to fetch payments');
        }
      } catch (err) {
        console.error(err);
        setError('Error loading payments');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, []);
  
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Loading payments...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (payments.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">No Payments Found</h2>
        <p className="text-gray-600 mb-6">You haven't made any payments yet.</p>
        <Link 
          to="/" 
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Make a Payment
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Payment History</h2>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Payment ID</th>
                <th className="py-3 px-6 text-left">Order ID</th>
                <th className="py-3 px-6 text-left">Amount</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {payments.map((payment) => (
                <tr key={payment._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 whitespace-nowrap">
                    {payment.razorpay_payment_id.substring(0, 10)}...
                  </td>
                  <td className="py-3 px-6 whitespace-nowrap">
                    {payment.razorpay_order_id.substring(0, 10)}...
                  </td>
                  <td className="py-3 px-6">
                    {payment.amount} {payment.currency}
                  </td>
                  <td className="py-3 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                      payment.status === 'created' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 whitespace-nowrap">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <Link 
                      to={`/payments/${payment._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsList;
