
import React from "react";
import DishCard from "@/components/dishes/DishCard";
import { Button } from "@/components/ui/button";

const MealSection = ({ title, dishes, onAddToCart, showViewAllButton = false, onViewAll = null }) => {
  return (
    <div className="mb-10">
      <div className="flex items-center mb-6">
        <div className="h-1 bg-green-500 flex-grow mr-4"></div>
        <h2 className="text-2xl font-serif font-semibold text-green-700">{title}</h2>
        <div className="h-1 bg-green-500 flex-grow ml-4"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map((dish) => (
          <DishCard
            key={dish.id}
            id={dish.id}
            name={dish.name}
            description={dish.description}
            price={dish.price}
            image={dish.image}
            category={dish.categoryId === "indian" ? "Indian" : dish.mealType}
            dietary={dish.dietary}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
      {showViewAllButton && dishes.length > 3 && (
        <div className="text-center mt-4">
          <Button 
            variant="outline" 
            className="border-green-300 text-green-700" 
            onClick={onViewAll}
          >
            View All {title}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MealSection;
