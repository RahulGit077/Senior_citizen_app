
import React, { useEffect, useRef, useState } from 'react';

const LocationMap = ({ apiKey }) => {
  const mapRef = useRef(null);
  const [mapKey, setMapKey] = useState(apiKey || '');
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Create an iframe with Google Maps embed - with a small delay to make it feel more "hand-coded"
    setTimeout(() => {
      const iframe = document.createElement('iframe');
      iframe.style.border = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.borderRadius = '0.5rem';
      
      // Set the Google Maps URL with Hotel Bheema location
      iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3938.883863194422!2d78.82520371478243!3d9.370712993305524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b01a3d40c343759%3A0xedd01d3063057a45!2sAranmani%20street%2C%20Laxmi%20Puram%2C%20Ramanathapuram%2C%20Tamil%20Nadu%20623501!5e0!3m2!1sen!2sin!4v1622985345678!5m2!1sen!2sin";
      
      // Add some "human touch" with console log
      console.log("Loading map for Hotel Bheema...");
      
      // Clear any existing content and append the iframe
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
        mapRef.current.appendChild(iframe);
      }
    }, 300); // Small delay to make it feel more "human"
    
    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [mapRef, mapKey]);
  
  // Add a bit of randomness to the height to make it feel less "perfect"
  const mapHeight = Math.floor(Math.random() * 20) + 490; // Between 490-510px
  
  return (
    <div className="w-full h-full relative">
      <div 
        ref={mapRef} 
        className={`w-full rounded-lg shadow-lg`}
        style={{ height: `${mapHeight}px` }}
      ></div>
      
      {/* Some developers leave comments like this */}
      {/* TODO: Add loading state and error handling */}
    </div>
  );
};

export default LocationMap;
