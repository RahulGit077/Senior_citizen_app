import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface DishCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  dietary?: string[];
  category: string;
}

const DishCard: React.FC<DishCardProps> = ({
  id,
  name,
  description,
  price,
  image,
  dietary = [],
  category
}) => {
  const { toast } = useToast();

  const handleAddToCart = (id: string) => {
    // Get current cart from localStorage
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log("hii");
    // Check if item already exists in cart
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === id);
    
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
    <Card className="dish-card">
      <div className="relative">
        <img src={image} alt={name} className="h-48 w-full object-cover" />
      </div>
      <CardHeader className="pt-4 pb-0">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg font-serif">{name}</h3>
          <span className="font-bold text-hotel-600">${price.toFixed(2)}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-gray-500 text-sm line-clamp-2">{description}</p>
        {dietary.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {dietary.map((item) => (
              <Badge key={item} variant="outline" className="text-xs">
                {item}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button onClick={() => handleAddToCart(id)} className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DishCard;
