import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">Razorpay Testing</Link>
          <div className="flex space-x-4">
            <Link to="/" className="hover:text-blue-200">New Payment</Link>
            <Link to="/payments" className="hover:text-blue-200">Payment History</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
