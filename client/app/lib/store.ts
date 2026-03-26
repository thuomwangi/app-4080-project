export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  seller: string;
  description: string;
  emoji: string;
  stock: number;
  tag?: string;
  createdAt: string;
}

export interface CartItem extends Product {
  qty: number;
}

export const CATEGORIES = ["All", "Textbooks", "Electronics", "Dorm Essentials", "Clothing", "Other"];

// Initial data for first-time load
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "0",
    name: "Used Gaming Laptop",
    price: 95000,
    category: "Electronics",
    seller: "TechMaster",
    description: "High-performance laptop perfect for gaming and engineering software.",
    emoji: "💻",
    stock: 1,
    tag: "Featured",
    createdAt: new Date().toISOString(),
  },
  {
    id: "1",
    name: "Calculus III Textbook",
    price: 4500,
    category: "Textbooks",
    seller: "MathWiz",
    description: "Barely used, great condition, latest edition for USIU math courses.",
    emoji: "📚",
    stock: 3,
    tag: "Urgent",
    createdAt: new Date().toISOString(),
  }
];

// --- Product Logic (Dynamic) ---

export const getProducts = (): Product[] => {
  if (typeof window === "undefined") return INITIAL_PRODUCTS;
  const stored = localStorage.getItem("campus_products");
  if (!stored) {
    // If empty, seed with initial products
    localStorage.setItem("campus_products", JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  return JSON.parse(stored);
};

export const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
  };
  const updated = [...products, newProduct];
  localStorage.setItem("campus_products", JSON.stringify(updated));
  return newProduct;
};

export const deleteProduct = (id: string) => {
  const products = getProducts();
  const updated = products.filter(p => p.id !== id);
  localStorage.setItem("campus_products", JSON.stringify(updated));
};

// --- Cart Logic ---

export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const cart = localStorage.getItem("campus_cart");
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product: Product) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  localStorage.setItem("campus_cart", JSON.stringify(cart));
};

export const removeFromCart = (id: string) => {
  const cart = getCart();
  const updated = cart.filter((item) => item.id !== id);
  localStorage.setItem("campus_cart", JSON.stringify(updated));
};

export const updateCartQty = (id: string, delta: number) => {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      const updated = cart.filter((i) => i.id !== id);
      localStorage.setItem("campus_cart", JSON.stringify(updated));
    } else {
      localStorage.setItem("campus_cart", JSON.stringify(cart));
    }
  }
};