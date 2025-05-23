
import React from "react";
import MealSection from "./MealSection";

const AllCategoriesView = ({ mealSections, onAddToCart, setActiveCategory }) => {
  return (
    <>
      {/* Indian Specialties Section */}
      {mealSections.indian.length > 0 && (
        <MealSection
          title="Indian Specialties"
          dishes={mealSections.indian.filter((_, index) => index < 3)}
          onAddToCart={onAddToCart}
          showViewAllButton={mealSections.indian.length > 3}
          onViewAll={() => setActiveCategory("indian")}
        />
      )}

      {/* Chinese Fusion Section */}
      {mealSections.chinese && mealSections.chinese.length > 0 && (
        <MealSection
          title="Indo-Chinese Fusion"
          dishes={mealSections.chinese.filter((_, index) => index < 3)}
          onAddToCart={onAddToCart}
          showViewAllButton={mealSections.chinese.length > 3}
          onViewAll={() => setActiveCategory("chinese")}
        />
      )}

      {/* Breakfast Section */}
      {mealSections.breakfast.length > 0 && (
        <MealSection
          title="Breakfast"
          dishes={mealSections.breakfast.filter(dish => dish.categoryId !== "indian" && dish.categoryId !== "chinese")}
          onAddToCart={onAddToCart}
        />
      )}

      {/* Lunch Section */}
      {mealSections.lunch.length > 0 && mealSections.lunch.filter(dish => dish.categoryId !== "indian" && dish.categoryId !== "chinese").length > 0 && (
        <MealSection
          title="Lunch"
          dishes={mealSections.lunch.filter(dish => dish.categoryId !== "indian" && dish.categoryId !== "chinese")}
          onAddToCart={onAddToCart}
        />
      )}

      {/* Dinner Section */}
      {mealSections.dinner.length > 0 && mealSections.dinner.filter(dish => dish.categoryId !== "indian" && dish.categoryId !== "chinese").length > 0 && (
        <MealSection
          title="Dinner"
          dishes={mealSections.dinner.filter(dish => dish.categoryId !== "indian" && dish.categoryId !== "chinese")}
          onAddToCart={onAddToCart}
        />
      )}
    </>
  );
};

export default AllCategoriesView;
