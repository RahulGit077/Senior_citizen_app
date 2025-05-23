
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Category {
  id: string;
  name: string;
}

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange
}) => {
  return (
    <Tabs defaultValue={activeCategory} onValueChange={onCategoryChange}>
      <TabsList className="grid grid-flow-col auto-cols-max gap-2 overflow-x-auto w-full justify-start p-1 mb-6">
        <TabsTrigger value="all" className="px-4">
          All
        </TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger key={category.id} value={category.id} className="px-4">
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;
