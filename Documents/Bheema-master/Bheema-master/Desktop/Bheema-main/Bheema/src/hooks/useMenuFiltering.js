
import { useState, useMemo } from "react";

const useMenuFiltering = (dishes) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter dishes based on search query and active category
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const matchesCategory = activeCategory === "all" || dish.mealType === activeCategory || 
                           (activeCategory === "indian" && dish.categoryId === "indian") ||
                           (activeCategory === "chinese" && dish.categoryId === "chinese");
      const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dish.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [dishes, activeCategory, searchQuery]);

  // Group dishes by meal type for display
  const mealSections = useMemo(() => {
    return {
      breakfast: filteredDishes.filter(dish => dish.mealType === "breakfast"),
      lunch: filteredDishes.filter(dish => dish.mealType === "lunch"),
      dinner: filteredDishes.filter(dish => dish.mealType === "dinner"),
      indian: filteredDishes.filter(dish => dish.categoryId === "indian"),
      chinese: filteredDishes.filter(dish => dish.categoryId === "chinese")
    };
  }, [filteredDishes]);

  // Only show sections that have dishes when filtering
  const visibleSections = useMemo(() => {
    return Object.entries(mealSections)
      .filter(([sectionName, dishes]) => {
        if (activeCategory === "all") return dishes.length > 0;
        if (activeCategory === "indian") return sectionName === "indian" && dishes.length > 0;
        if (activeCategory === "chinese") return sectionName === "chinese" && dishes.length > 0;
        return sectionName === activeCategory && dishes.length > 0;
      });
  }, [mealSections, activeCategory]);

  return {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    filteredDishes,
    mealSections,
    visibleSections
  };
};

export default useMenuFiltering;
