
import React from "react";
import DishCard from "@/components/dishes/DishCard";

const CategoryView = ({ dishes, onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dishes.map((dish) => (
        <DishCard
          key={dish.id}
          id={dish.id}
          name={dish.name}
          description={dish.description}
          price={dish.price}
          image={dish.image}
          category={dish.mealType}
          dietary={dish.dietary}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default CategoryView;
