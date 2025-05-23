
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ChefHat, 
  FileText, 
  Home, 
  LogOut, 
  Menu as MenuIcon, 
  Settings, 
  ShoppingBag, 
  Users, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-40 lg:hidden`} role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <span className="text-green-800 font-serif text-xl font-bold">Hotel Bheema</span>
              <span className="ml-2 text-sm text-gray-500">Admin</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              <MobileNavItem to="/admin" icon={<Home className="h-6 w-6" />} label="Dashboard" />
              <MobileNavItem to="/admin/orders" icon={<FileText className="h-6 w-6" />} label="Orders" />
              <MobileNavItem to="/admin/kitchen" icon={<ChefHat className="h-6 w-6" />} label="Kitchen View" />
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400" />
              <span>Log out</span>
            </button>
          </div>
        </div>
        <div className="flex-shrink-0 w-14"></div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <span className="text-green-800 font-serif text-xl font-bold">Hotel Bheemas</span>
                <span className="ml-2 text-sm text-gray-500">Admin</span>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                <DesktopNavItem to="/admin" icon={<Home className="h-5 w-5" />} label="Dashboard" />
                <DesktopNavItem to="/admin/orders" icon={<FileText className="h-5 w-5" />} label="Orders" />
                <DesktopNavItem to="/admin/kitchen" icon={<ChefHat className="h-5 w-5" />} label="Kitchen View" />
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-hotel-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <h1 className="text-xl font-semibold text-gray-800 self-center">Admin Dashboard</h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <Button variant="outline" asChild>
                <Link to="/">View Site</Link>
              </Button>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const MobileNavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ 
  to, icon, label 
}) => {
  return (
    <Link 
      to={to} 
      className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md"
    >
      <div className="mr-4 text-gray-400 group-hover:text-gray-500">
        {icon}
      </div>
      {label}
    </Link>
  );
};

const DesktopNavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ 
  to, icon, label 
}) => {
  return (
    <Link 
      to={to} 
      className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
    >
      <div className="mr-3 text-gray-400 group-hover:text-gray-500">
        {icon}
      </div>
      {label}
    </Link>
  );
};

export default AdminLayout;
