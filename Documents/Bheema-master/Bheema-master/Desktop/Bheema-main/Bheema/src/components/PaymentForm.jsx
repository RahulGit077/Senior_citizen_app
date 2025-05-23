import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For react-router-dom v5

const PaymentForm = () => {
  const [amount, setAmount] = useState(100);
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      
      const res = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        script.onload = () => {
          const options = {
            key: data.key_id,
            amount: data.order.amount,
            currency: data.order.currency,
            name: 'Shrinivassan',
            description: 'Education',
            order_id: data.order.id,
            handler: async function(response) {
              try {
                const verifyRes = await fetch('http://localhost:5000/api/payments/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                });
                
                const verifyData = await verifyRes.json();
                
                if (verifyData.success) {
                  navigate('/success', { 
                    state: { 
                      paymentId: verifyData.payment.id,
                      orderId: response.razorpay_order_id,
                      amount: amount 
                    }
                  });
                } else {
                  setError('Payment verification failed');
                }
              } catch (err) {
                console.error(err);
                setError('Payment verification failed');
              } finally {
                setLoading(false);
              }
            },
            prefill: {
              name: 'Test User',
              email: 'test@example.com',
              contact: '9999999999'
            },
            theme: {
              color: '#3B82F6'
            }
          };
          
          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
        };
        
        script.onerror = () => {
          setError('Failed to load Razorpay checkout');
          setLoading(false);
        };
      } else {
        setError('Failed to create order');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Make a Test Payment</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="INR">INR (Indian Rupee)</option>
            <option value="USD">USD (US Dollar)</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
