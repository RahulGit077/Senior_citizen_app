
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import DishCard from "@/components/dishes/DishCard";
import { useToast } from "@/hooks/use-toast";
import OrderStatusTracker from "@/components/orders/OrderStatusTracker";
import OrderCard from "@/components/orders/OrderCard";
import { MapPin } from "lucide-react";

//  data
const featuredDishes = [
  {
    id: "201",
    name: "Chilly Panneer Gravy",
    description: "Spicy paneer in a rich Indo-Chinese gravy.",
    price: 173,
    image: "/Assets/Chiily Panner.png",
    category: "Gravies",
    dietary: ["Vegetarian"]
  },
  {
    id: "202",
    name: "Chilly Mushroom Dry",
    description: "Crisp-fried mushrooms in spicy dry chilli sauce.",
    price: 130,
    image: "/Assets/Chilly Mushroom dy.png",
    category: "Gravies",
    dietary: ["Vegetarian"]
  },
  {
    id: "203",
    name: "Chilly Parotta",
    description: "Fried parotta tossed in chilli garlic masala.",
    price: 145,
    image: "/Assets/Chilly Parotta.png",
    category: "Dinner",
    dietary: ["Vegetarian"]
  },
  {
    id: "204",
    name: "Dragon Panneer",
    description: "Crispy paneer in fiery dragon sauce.",
    price: 173,
    image: "/Assets/Dragon_Panner.png",
    category: "Main Course",
    dietary: ["Vegetarian"]
  },
  {
    id: "205",
    name: "Gobi Manchurian Dry",
    description: "Fried cauliflower tossed in dry manchurian sauce.",
    price: 111,
    image: "/Assets/Gobi Machurian Dry.png",
    category: "Dinner",
    dietary: ["Vegetarian"]
  },
  {
    id: "206",
    name: "Kaima Parotta",
    description: "Spicy minced parotta stir-fry in south Indian style.",
    price: 145,
    image: "/Assets/kaima_parotta.png",
    category: "Dinner",
    dietary: ["Vegetarian"]
  },
  {
    id: "207",
    name: "Mixed Shezwan Fried Rice",
    description: "Assorted veggies in schezwan flavored rice.",
    price: 135,
    image: "/Assets/mixed shezwan fried rice.png",
    category: "Lunch",
    dietary: ["Vegetarian"]
  },
  {
    id: "208",
    name: "Mushroom Manchurian Dry",
    description: "Crispy mushroom balls tossed in spicy sauce.",
    price: 130,
    image: "/Assets/Mushroom dry.png",
    category: "Gravies",
    dietary: ["Vegetarian"]
  },
  {
    id: "209",
    name: "Mushroom Noodles",
    description: "Chinese-style noodles with stir-fried mushrooms.",
    price: 124,
    image: "/Assets/Mushroom_noodles.png",
    category: "Lunch",
    dietary: ["Vegetarian"]
  },
  {
    id: "210",
    name: "Paneer",
    description: "Classic Indian cottage cheese cooked in house style.",
    price: 140,
    image: "/Assets/panner.png",
    category: "Main Course",
    dietary: ["Vegetarian"]
  },
  {
    id: "211",
    name: "Paneer Butter Masala",
    description: "Creamy tomato-based gravy with soft paneer cubes.",
    price: 130,
    image: "/Assets/panner_butter_masala.png",
    category: "Main Course",
    dietary: ["Vegetarian"]
  },
  {
    id: "212",
    name: "Paneer Noodles",
    description: "Spicy noodles with crispy paneer chunks.",
    price: 137,
    image: "/Assets/Panner_Noodles.png",
    category: "Lunch",
    dietary: ["Vegetarian"]
  },
  {
    id: "213",
    name: "Paneer Pulao",
    description: "Basmati rice with mildly spiced paneer cubes.",
    price: 160,
    image: "/Assets/Panner_pulao.png",
    category: "Breakfast",
    dietary: ["Vegetarian"]
  },
  {
    id: "214",
    name: "Schezwan Fried Rice",
    description: "Hot and spicy schezwan-flavored fried rice.",
    price: 130,
    image: "/Assets/Schezwan Fried rice.png",
    category: "Lunch",
    dietary: ["Vegetarian"]
  },
  {
    id: "215",
    name: "Schezwan Mushroom",
    description: "Spicy mushrooms in schezwan sauce.",
    price: 130,
    image: "/Assets/Schezwan Mushroom.png",
    category: "Gravies",
    dietary: ["Vegetarian"]
  },
  {
    id: "216",
    name: "Schezwan Paneer Noodles",
    description: "Hot schezwan-style noodles with paneer.",
    price: 137,
    image: "/Assets/Schezwan Panner noodles.png",
    category: "Lunch",
    dietary: ["Vegetarian"]
  },
  {
    id: "217",
    name: "Mix Veg Gravy",
    description: "Assorted vegetables cooked in rich Indian gravy.",
    price: 117,
    image: "/Assets/Veg_mix.png",
    category: "Gravies",
    dietary: ["Vegetarian"]
  }   
];

const recentOrder = {
  id: "order-123",
  orderNumber: "12345",
  date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  status: "preparing" as const,
  items: [
    { id: "1", name: "Schezwan Paneer Noodles", quantity: 1, price: 28.99 },
    { id: "2", name: "Schezwan Fried Rice", quantity: 1, price: 22.50 },
    { id: "3", name: "New York Cheesecake", quantity: 1, price: 12.99 }
  ],
  total: 64.48,
  roomNumber: "304"
};

const Index: React.FC = () => {
  const { toast } = useToast();
  
  const handleAddToCart = (id: string) => {
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart",
    });
  };
  
  const handleViewOrderDetails = (id: string) => {
    // In a real app, this would navigate to the order details page
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-96" style={{  backgroundImage: "url('/Assets/Sri-Bheema-Vilas.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-lg">
            <h1 className="text-4xl font-serif font-bold mb-4">
              Hotel Bheema Luxury Dining
            </h1>
            <p className="text-lg mb-6">
              Order from our award-winning menu and enjoy delicious meals delivered straight to your room.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/menu">Browse Menu</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-black" asChild>
                <Link to="/orders">Track Order</Link>
              </Button>
              <Button size="lg" variant="secondary" className="flex items-center" asChild>
                <Link to="/location">
                  <MapPin className="mr-1 h-4 w-4" />
                  Our Location
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-baseline mb-6">
          <h2 className="text-2xl font-serif font-semibold text-gray-900">
            Featured Dishes
          </h2>
          <Link to="/menu" className="text-green-600 hover:text-hotel-700 font-medium">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDishes.map((dish) => (
            <DishCard
              key={dish.id}
              id={dish.id}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              image={dish.image}
              category={dish.category}
              dietary={dish.dietary}
            />
          ))}
        </div>
      </section>

      {/* Location Preview */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4 md:mb-0">
              Find Us in Ramanathapuram
            </h2>
            <Button variant="outline" asChild>
              <Link to="/location" className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 " />
                View on Map
              </Link>
            </Button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <MapPin className="h-6 w-6 text-green " />
              <p className="text-gray-700">Aranmani street, Laxmi Puram, Ramanathapuram, Tamil Nadu 623501</p>
              <Button variant="link" onClick={() => window.open("https://www.google.com/maps/dir//Aranmani+street,+Laxmi+Puram,+Ramanathapuram,+Tamil+Nadu+623501/@9.3707008,78.7453869,12z/", "_blank")} className="text-green-600 p-0">
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Order Tracking Preview */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-6">
            Track Your Order
          </h2>
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <OrderStatusTracker currentStatus={recentOrder.status} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OrderCard
              id={recentOrder.id}
              orderNumber={recentOrder.orderNumber}
              date={recentOrder.date}
              status={recentOrder.status}
              items={recentOrder.items}
              total={recentOrder.total}
              roomNumber={recentOrder.roomNumber}
              onViewDetails={handleViewOrderDetails}
            />
            <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-center items-center">
              <h3 className="text-xl font-medium mb-4 text-center">Need Help with Your Order?</h3>
              <p className="text-gray-600 text-center mb-6">
                Our staff is available 24/7 to assist you with your dining needs.
              </p>
              <Button onClick={()=>{window.location.href='/orders';}}variant="outline" className="w-full sm:w-auto">
                Contact  Service
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-12 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Browse Our Menu</h3>
            <p className="text-gray-600">
              Explore our extensive menu of delicious dishes prepared by our world-class chefs.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Place Your Order</h3>
            <p className="text-gray-600">
              Select your desired dishes, customize them to your preference, and place your order.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Delivery to Your Room</h3>
            <p className="text-gray-600">
              Track your order in real-time and enjoy delivery straight to your room.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
