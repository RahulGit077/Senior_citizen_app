
import React from "react";
import MealSection from "./MealSection";

const IndianSpecialtiesView = ({ indianDishes, onAddToCart }) => {
  // Sort dishes to put Chilly Parotta and other special items at the beginning
  const sortedDishes = [...indianDishes].sort((a, b) => {
    const priorityItems = ["Chilly Parotta", "Kaima Parotta"];
    
    // If item a is in priority list but b is not
    if (priorityItems.includes(a.name) && !priorityItems.includes(b.name)) return -1;
    // If item b is in priority list but a is not
    if (!priorityItems.includes(a.name) && priorityItems.includes(b.name)) return 1;
    // If both or neither are in priority list, maintain original order
    return 0;
  });

  return (
    <MealSection
      title="Indian Specialties"
      dishes={sortedDishes}
      onAddToCart={onAddToCart}
    />
  );
};

export default IndianSpecialtiesView;
