
import React, { useEffect, useRef } from 'react';

interface LocationMapProps {
  apiKey?: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ apiKey }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapKey, setMapKey] = React.useState<string>(apiKey || '');
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Create an iframe with Google Maps embed
    const iframe = document.createElement('iframe');
    iframe.style.border = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.borderRadius = '0.5rem';
    
    // Set the Google Maps URL with the Hotel Bheema location
    iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3938.883863194422!2d78.82520371478243!3d9.370712993305524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b01a3d40c343759%3A0xedd01d3063057a45!2sAranmani%20street%2C%20Laxmi%20Puram%2C%20Ramanathapuram%2C%20Tamil%20Nadu%20623501!5e0!3m2!1sen!2sin!4v1622985345678!5m2!1sen!2sin";
    
    // Clear any existing content and append the iframe
    if (mapRef.current) {
      mapRef.current.innerHTML = '';
      mapRef.current.appendChild(iframe);
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [mapRef, mapKey]);
  
  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-96 md:h-[500px] rounded-lg shadow-lg"></div>
    </div>
  );
};

export default LocationMap;
