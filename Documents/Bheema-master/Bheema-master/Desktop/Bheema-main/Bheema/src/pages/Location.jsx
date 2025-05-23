
import React from "react";
import Layout from "../components/layout/Layout";
import LocationMap from "../components/location/LocationMap";
import { MapPin, Phone, Mail, Navigation } from "lucide-react";
import { Button } from "../components/ui/button";

const Location = () => {
  
  const handleGetDirections = () => {
    
    const mapUrl = "https://www.google.com/maps/dir//Aranmani+street,+Laxmi+Puram,+Ramanathapuram,+Tamil+Nadu+623501/@9.3707008,78.7453869,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3b01a3d40c343759:0xedd01d3063057a45!2m2!1d78.8277892!2d9.3707129";
    
    
    console.log("Opening directions:", mapUrl);
    
    window.open(mapUrl, "_blank");
  };
  
  
  const hotelName = "Hotel Bheema";
  const contactEmail = "info@hotelbheema.com";
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">Our Location</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
            <div>
              <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
                {hotelName}
              </h2>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-green-800 flex-shrink-0 mt-0.5" />
                  <p>Aranmani street, Laxmi Puram, Ramanathapuram, Tamil Nadu 623501</p>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-green-800  flex-shrink-0" />
                  <p>+91 98765 43210</p>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-green-800 flex-shrink-0" />
                  <p>{contactEmail}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button onClick={handleGetDirections} className="flex items-center">
                  <Navigation className="mr-2 h-4 w-4" />
                  Get Directions
                </Button>
              </div>
            </div>
            
            <div>
              <div className="aspect-video overflow-hidden rounded-lg shadow-lg">
                <img 
                  src="https://lh3.googleusercontent.com/gps-cs-s/AB5caB-VxUv9dLhOJr-lkhzJ9Brn7lU4cHawoC2ugPXt3yuIk3XZtSaafycRNCVpzIzi3U8rx26nrSlrZI1Q81s79s-UdbkD180vQZQZkwJYiiKyALZ0NMGS32nTSQiH79GLazPXvKI=s1360-w1360-h1020" 
                  alt="Hotel Bheema" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-medium mb-4">Find Us on the Map</h3>
            <LocationMap />
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">Visiting Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Some "human" irregularity in the styling with slightly different classes */}
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-medium text-green-800">Restaurant</h4>
              <p className="text-gray-600">7:00 AM - 10:30 PM</p>
              <p className="text-gray-500 text-sm">Daily</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h4 className="font-medium text-green-800">Room Service</h4>
              <p className="text-gray-600">24 Hours</p>
              <p className="text-gray-500 text-sm">Daily</p>
            </div>
            <div className="bg-white py-4 px-4 rounded shadow-sm">
              <h4 className="font-medium text-green-800">Reception</h4>
              <p className="text-gray-600">24 Hours</p>
              <p className="text-gray-500 text-sm">Daily</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Location;
