import deskImg from "@/assets/products/desk.jpg";
import earbudsImg from "@/assets/products/earbuds.jpg";
import booksImg from "@/assets/products/books.jpg";
import backpackImg from "@/assets/products/backpack.jpg";
import lampImg from "@/assets/products/lamp.jpg";
import calculatorImg from "@/assets/products/calculator.jpg";
import laptopStandImg from "@/assets/products/laptop-stand.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  condition: "New" | "Like New" | "Good" | "Fair";
  location: string;
  seller: string;
  sellerAvatar: string;
  description: string;
  specs: Record<string, string>;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Ergonomic Study Desk with Integrated Storage",
    price: 149.99,
    originalPrice: 199.99,
    image: deskImg,
    images: [deskImg, deskImg, deskImg, deskImg],
    category: "Furniture",
    condition: "Like New",
    location: "West Campus",
    seller: "Alex Johnson",
    sellerAvatar: "AJ",
    description: "A spacious ergonomic study desk with built-in shelves and drawers. Perfect for dorm rooms and small apartments. Solid wood construction with a modern finish.",
    specs: { Material: "Solid Oak", Dimensions: '48" x 24" x 30"', Weight: "45 lbs", Color: "Natural Oak" },
    rating: 4.8,
    reviews: 24,
  },
  {
    id: "2",
    name: "Wireless Earbuds Pro",
    price: 45.00,
    originalPrice: 79.99,
    image: earbudsImg,
    images: [earbudsImg],
    category: "Electronics",
    condition: "New",
    location: "North Campus",
    seller: "Sarah Kim",
    sellerAvatar: "SK",
    description: "Premium wireless earbuds with noise cancellation, 8-hour battery life, and crystal-clear audio. Perfect for studying and commuting.",
    specs: { Battery: "8 hours", Connectivity: "Bluetooth 5.2", "Noise Cancellation": "Active", Weight: "5g per earbud" },
    rating: 4.5,
    reviews: 18,
  },
  {
    id: "3",
    name: "University Textbook Bundle",
    price: 35.00,
    image: booksImg,
    images: [booksImg],
    category: "Books",
    condition: "Good",
    location: "Library Area",
    seller: "Mike Chen",
    sellerAvatar: "MC",
    description: "Bundle of 5 essential university textbooks covering Computer Science, Mathematics, and Physics. All in good condition with minimal highlighting.",
    specs: { Subjects: "CS, Math, Physics", Quantity: "5 books", Edition: "Latest", Condition: "Minimal wear" },
    rating: 4.2,
    reviews: 12,
  },
  {
    id: "4",
    name: "Campus Backpack",
    price: 29.99,
    originalPrice: 49.99,
    image: backpackImg,
    images: [backpackImg],
    category: "Clothing",
    condition: "New",
    location: "Student Center",
    seller: "Emma Davis",
    sellerAvatar: "ED",
    description: "Durable and stylish campus backpack with laptop compartment, multiple pockets, and water-resistant fabric.",
    specs: { Capacity: "30L", "Laptop Size": "Up to 15.6\"", Material: "Water-resistant nylon", Pockets: "6" },
    rating: 4.6,
    reviews: 31,
  },
  {
    id: "5",
    name: "Adjustable Desk Lamp",
    price: 22.00,
    image: lampImg,
    images: [lampImg],
    category: "Study Gear",
    condition: "Like New",
    location: "East Campus",
    seller: "Tom Wilson",
    sellerAvatar: "TW",
    description: "Modern LED desk lamp with adjustable arm and brightness levels. USB charging port included. Energy efficient.",
    specs: { Type: "LED", Brightness: "3 levels", Power: "USB-C", "Color Temp": "3000K-6000K" },
    rating: 4.4,
    reviews: 9,
  },
  {
    id: "6",
    name: "Scientific Calculator",
    price: 15.00,
    originalPrice: 25.00,
    image: calculatorImg,
    images: [calculatorImg],
    category: "Electronics",
    condition: "Good",
    location: "Science Building",
    seller: "Lisa Park",
    sellerAvatar: "LP",
    description: "Professional scientific calculator perfect for engineering and science courses. All functions working perfectly.",
    specs: { Brand: "Texas Instruments", Model: "TI-84 Plus", Functions: "200+", Power: "Solar + Battery" },
    rating: 4.3,
    reviews: 15,
  },
  {
    id: "7",
    name: "Laptop Stand - Aluminum",
    price: 28.00,
    image: laptopStandImg,
    images: [laptopStandImg],
    category: "Study Gear",
    condition: "New",
    location: "Tech Hub",
    seller: "Chris Lee",
    sellerAvatar: "CL",
    description: "Premium aluminum laptop stand with ergonomic height adjustment. Compatible with all laptops up to 17 inches.",
    specs: { Material: "Aluminum alloy", Compatibility: "Up to 17\"", Adjustable: "Yes", Weight: "1.2 lbs" },
    rating: 4.7,
    reviews: 22,
  },
  {
    id: "8",
    name: "Mini Fridge for Dorms",
    price: 65.00,
    originalPrice: 89.99,
    image: lampImg,
    images: [lampImg],
    category: "Furniture",
    condition: "Good",
    location: "South Campus",
    seller: "Amy Zhang",
    sellerAvatar: "AZ",
    description: "Compact mini fridge, perfect for dorm rooms. Quiet operation, adjustable thermostat.",
    specs: { Capacity: "3.2 cu ft", Noise: "< 40dB", Energy: "A+", Dimensions: '18" x 17" x 20"' },
    rating: 4.1,
    reviews: 8,
  },
];

export const categories = [
  { name: "Electronics", icon: "Monitor" as const, count: 234 },
  { name: "Furniture", icon: "Sofa" as const, count: 156 },
  { name: "Books", icon: "BookOpen" as const, count: 421 },
  { name: "Clothing", icon: "Shirt" as const, count: 189 },
  { name: "Study Gear", icon: "Lightbulb" as const, count: 95 },
  { name: "Sports", icon: "Dumbbell" as const, count: 67 },
];
