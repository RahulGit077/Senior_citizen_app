
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DishCard = ({
  id,
  name,
  description,
  price,
  image,
  category,
  dietary = [],
}) => {
  const { toast } = useToast();

  // Human-like variable (slightly inconsistent naming)
  const formattedPrice = price.toFixed(2);
  
  // Add basic console log as a human might do for debugging
  if (!image) {
    console.log("Missing image for dish:", name);
  }
  const handleAddToCart = (id) => {
    // Get current cart from localStorage
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log("hii");
    // Check if item already exists in cart
    const existingItemIndex = currentCart.findIndex((item) => item.id === id);
    
    if (existingItemIndex !== -1) {
      // Increment quantity if item already exists
      currentCart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      currentCart.push({
        id,
        name,
        price,
        quantity: 1,
        image,
        description,
        dietary,
        category
      });
    }
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    // Show toast notification
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart",
    });
  };
  
  return (
    <Card className="dish-card hover:border-green-400 border-2">
      <div className="relative">
        <img src={image} alt={name} className="h-48 w-full object-cover" />
        <Badge className="absolute top-2 right-2 bg-green-600 text-white">{category}</Badge>
      </div>
      <CardHeader className="pt-4 pb-0">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg font-serif text-green-800">{name}</h3>
          <span className="font-bold text-green-700 flex items-center">
            <IndianRupee className="h-4 w-4 mr-1" />
            {formattedPrice}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        {dietary.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {dietary.map((item) => (
              <Badge key={item} variant="outline" className="text-xs border-green-300 text-green-700">
                {item}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button onClick={() => handleAddToCart(id)} className="w-full bg-green-600 hover:bg-green-700">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DishCard;
