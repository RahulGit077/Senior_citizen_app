
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CategoryTabs = ({
  categories,
  activeCategory,
  onCategoryChange
}) => {
  // Human-like debugging log
  console.log("Rendering tabs with active:", activeCategory);
  
  return (
    <Tabs defaultValue={activeCategory} onValueChange={onCategoryChange}>
      <TabsList className="grid grid-flow-col auto-cols-max gap-2 overflow-x-auto w-full justify-start p-1 mb-6 bg-green-50 border border-green-200">
        {categories.map((category) => (
          <TabsTrigger 
            key={category.id} 
            value={category.id} 
            className="px-4 data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;
