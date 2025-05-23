
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-green-50 border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-lg font-serif font-semibold text-green-800 mb-4">
              Hotel Bheema
            </h2>
            <p className="text-green-700 text-sm">
              Experience luxury dining at Hotel Bheema. Order from the comfort of your room and track your delivery in real-time.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-green-800 tracking-wider uppercase mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-green-600 hover:text-green-800 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-green-600 hover:text-green-800 text-sm">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-green-600 hover:text-green-800 text-sm">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/location" className="text-green-600 hover:text-green-800 text-sm">
                  Location
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-green-600 hover:text-green-800 text-sm">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-green-800 tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-green-600 hover:text-green-800 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-green-600 hover:text-green-800 text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-green-800 tracking-wider uppercase mb-4">
              Contact
            </h3>
            <div className="text-green-600 text-sm mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <p>Aranmani street, Laxmi Puram, Ramanathapuram, Tamil Nadu 623501</p>
            </div>
            <div className="text-green-600 text-sm mb-2 flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <p>Room Service: +91 98765 43210</p>
            </div>
            <div className="text-green-600 text-sm flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              <p>info@hotelbheema.com</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-green-200">
          <p className="text-green-600 text-sm text-center">
            &copy; {currentYear} Hotel Bheema. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
