
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import DishCard from "@/components/dishes/DishCard";
import CategoryTabs from "@/components/dishes/CategoryTabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";

// Sample data
const categories = [
  { id: "breakfast", name: "Breakfast" },
  { id: "lunch", name: "Lunch" },
  { id: "dinner", name: "Dinner" },
  { id: "desserts", name: "Desserts" },
  { id: "beverages", name: "Beverages" },
];

const dishes = [
  {
    id: "1",
    name: "Paneer Butter Masala",
    description: "Cottage cheese cubes simmered in a rich tomato and cream-based gravy, infused with Indian spices.",
    price: 220.00,
    image: "https://images.unsplash.com/photo-1633526542098-5e0b2c870dfc?w=500&auto=format&fit=crop&q=60",
    categoryId: "lunch",
    dietary: ["Vegetarian", "Gluten Free"]
  },
  {
    id: "2",
    name: "Masala Dosa",
    description: "Crispy fermented rice and lentil crepe filled with a spicy potato masala, served with coconut chutney and sambar.",
    price: 110.00,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=60",
    categoryId: "breakfast",
    dietary: ["Vegetarian"]
  },
  {
    id: "3",
    name: "Gulab Jamun",
    description: "Deep-fried milk solid balls soaked in rose-scented sugar syrup, served warm.",
    price: 80.00,
    image: "https://images.unsplash.com/photo-1620497185397-27f14f6b8414?w=500&auto=format&fit=crop&q=60",
    categoryId: "desserts",
    dietary: ["Vegetarian"]
  },
  {
    id: "4",
    name: "Palak Paneer",
    description: "Spinach purée blended with Indian spices and cubes of cottage cheese, served hot.",
    price: 200.00,
    image: "https://images.unsplash.com/photo-1669292451381-e23a88d142eb?w=500&auto=format&fit=crop&q=60",
    categoryId: "dinner",
    dietary: ["Vegetarian", "Gluten Free"]
  },
  {
    id: "5",
    name: "Chole Bhature",
    description: "Spicy chickpeas cooked in a flavorful gravy, served with deep-fried puffy bread.",
    price: 150.00,
    image: "https://images.unsplash.com/photo-1662299211727-e08a9b564848?w=500&auto=format&fit=crop&q=60",
    categoryId: "lunch",
    dietary: ["Vegetarian"]
  },
  {
    id: "6",
    name: "Masala Chai",
    description: "Indian spiced tea made with black tea, milk, and a blend of aromatic spices.",
    price: 30.00,
    image: "https://images.unsplash.com/photo-1630551455021-15c98645c302?w=500&auto=format&fit=crop&q=60",
    categoryId: "beverages",
    dietary: ["Vegetarian"]
  },
  {
    id: "7",
    name: "Rasgulla",
    description: "Spongy and soft cottage cheese balls soaked in sugar syrup, chilled and refreshing.",
    price: 60.00,
    image: "https://images.unsplash.com/photo-1621285290071-2f3e084e0f77?w=500&auto=format&fit=crop&q=60",
    categoryId: "desserts",
    dietary: ["Vegetarian", "Gluten Free"]
  },
  {
    id: "8",
    name: "Vegetable Pulao",
    description: "Fragrant basmati rice cooked with mixed vegetables and aromatic Indian spices.",
    price: 180.00,
    image: "https://images.unsplash.com/photo-1620842141953-02cc697f53ff?w=500&auto=format&fit=crop&q=60",
    categoryId: "dinner",
    dietary: ["Vegetarian", "Gluten Free"]
  }
];


const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleAddToCart = (id: string) => {
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart",
    });
  };

  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory = activeCategory === "all" || dish.categoryId === activeCategory;
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "";
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-serif font-bold mb-3 text-green-800">Our Menu</h1>
          <p className="text-green-700 max-w-3xl">
            Discover our exquisite selection of dishes crafted by our award-winning chefs. 
            All meals are prepared with the freshest ingredients and can be delivered 
            directly to your room.
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" size={18} />
            <Input 
              type="search"
              placeholder="Search dishes..."
              className="pl-10 border-green-200 focus:border-green-300"
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

        {filteredDishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                id={dish.id}
                name={dish.name}
                description={dish.description}
                price={dish.price}
                image={dish.image}
                category={getCategoryName(dish.categoryId)}
                dietary={dish.dietary}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-green-800">No dishes found</h3>
            <p className="mt-2 text-green-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Menu;
