
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Location from "./pages/Location";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signupt";
// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import OrdersAdmin from "./pages/admin/Orders";
import Kitchen from "./pages/admin/Kitchen";
import LoginPages from "./pages/AdminLogin";

//payments
import Navbar from './components/navbar';
import PaymentForm from './components/PaymentForm';
import PaymentSuccess from './components/PaymentSucess';
import PaymentsList from './components/PaymentsList';
import PaymentDetails from './components/PaymentDetails';
import axios from 'axios';
// Set base URL for API requests
axios.defaults.baseURL = 'http://localhost:5000';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/location" element={<Location />} />
          <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route path="/adlogin" element={<LoginPages/>} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/orders" element={<OrdersAdmin />} />
          <Route path="/admin/kitchen" element={<Kitchen />} />
          {/* Payment Routes */}
                      <Route path="/paymentform" element={<PaymentForm />} />
                      <Route path="/success" element={<PaymentSuccess />} />
                      <Route path="/payments" element={<PaymentsList />} />
            <Route path="/payments/:id" element={<PaymentDetails />} />
          {/* Catch all route for non-existing routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
