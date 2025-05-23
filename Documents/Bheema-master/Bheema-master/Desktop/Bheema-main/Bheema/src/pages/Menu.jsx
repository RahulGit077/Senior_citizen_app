
import React from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { categories, dishes } from "@/data/menuData";
import useMenuFiltering from "@/hooks/useMenuFiltering";
import MenuHeader from "@/components/menu/MenuHeader";
import MenuSearch from "@/components/menu/MenuSearch";
import AllCategoriesView from "@/components/menu/AllCategoriesView";
import IndianSpecialtiesView from "@/components/menu/IndianSpecialtiesView";
import ChineseFusionView from "@/components/menu/ChineseFusionView";
import CategoryView from "@/components/menu/CategoryView";
import EmptyResults from "@/components/menu/EmptyResults";

// Main Menu component
const Menu = () => {
  const { toast } = useToast();
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    filteredDishes,
    mealSections,
    visibleSections
  } = useMenuFiltering(dishes);

  // Log for debugging - mimicking "human" development style
  console.log("Menu rendering with category:", activeCategory);

  const handleAddToCart = (id) => {
    // Some developers might add a log here
    console.log('Adding to cart:', id);
    
    const dish = dishes.find(dish => dish.id === id);
    
    toast({
      title: "Added to cart",
      description: dish ? `${dish.name} has been added to your cart` : "Item has been added to your cart",
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MenuHeader />

        <MenuSearch 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {visibleSections.length > 0 ? (
          <div className="space-y-12">
            {activeCategory === "indian" && (
              <IndianSpecialtiesView 
                indianDishes={mealSections.indian} 
                onAddToCart={handleAddToCart} 
              />
            )}

            {activeCategory === "chinese" && (
              <ChineseFusionView 
                chineseDishes={mealSections.chinese} 
                onAddToCart={handleAddToCart} 
              />
            )}

            {activeCategory === "all" && (
              <AllCategoriesView 
                mealSections={mealSections} 
                onAddToCart={handleAddToCart}
                setActiveCategory={setActiveCategory}
              />
            )}

            {/* Show filtered results based on category */}
            {activeCategory !== "all" && 
             activeCategory !== "indian" && 
             activeCategory !== "chinese" && (
              <CategoryView
                dishes={filteredDishes}
                onAddToCart={handleAddToCart}
              />
            )}
          </div>
        ) : (
          <EmptyResults 
            setSearchQuery={setSearchQuery} 
            setActiveCategory={setActiveCategory} 
          />
        )}
      </div>
    </Layout>
  );
};

export default Menu;
