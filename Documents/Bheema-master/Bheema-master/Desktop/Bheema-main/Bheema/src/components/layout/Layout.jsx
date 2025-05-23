
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Simple layout component that wraps the content with Navbar and Footer
const Layout = ({ children }) => {
  // Sometimes developers add console logs for debugging
  console.log("Rendering layout with light theme");
  
  // Return the layout structure with light background
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Export the Layout component
export default Layout;
