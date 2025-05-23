
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CategoryTabs from "@/components/dishes/CategoryTabs";

const MenuSearch = ({ searchQuery, setSearchQuery, categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          type="search"
          placeholder="Search dishes..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex-grow overflow-hidden">
        <CategoryTabs 
          categories={categories} 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>
    </div>
  );
};

export default MenuSearch;
