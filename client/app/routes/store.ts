/* ─── Types ─────────────────────────────────────────────── */
export type Product = {
  id: string;
  name: string;
  price: number;          // KSh
  category: string;
  description: string;
  stock: number;
  image: string | null;   // base64 compressed
  emoji: string;          // fallback icon
  seller: string;
  tag: string | null;
  createdAt: string;
};

export type CartItem = Product & { qty: number };

export type Order = {
  id: string;
  buyer: string;
  phone: string;
  hostel: string;
  items: CartItem[];
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered";
  date: string;
};

/* ─── SSR guard ──────────────────────────────────────────── */
const isBrowser = typeof window !== "undefined";

/* ─── Storage Keys ───────────────────────────────────────── */
const KEYS = {
  products: "campus-cart-products",
  cart:     "campus-cart-cart",
  orders:   "campus-cart-orders",
};

/* ─── Seed data ──────────────────────────────────────────── */
const SEED: Product[] = [
  { id:"p1",  name:"Calculus Textbook (8th Ed.)",  price:2800, category:"Books",       description:"Stewart Calculus, lightly used. Good condition, no highlights.",              stock:3, image:null, emoji:"📚", seller:"jane_s",   tag:"Used",       createdAt:"2026-02-01" },
  { id:"p2",  name:"Scientific Calculator TI-84",  price:5500, category:"Electronics", description:"Texas Instruments TI-84 Plus CE. Fully functional, with cover.",              stock:2, image:null, emoji:"🔢", seller:"mike_t",   tag:"Popular",    createdAt:"2026-02-03" },
  { id:"p3",  name:"Campus Hoodie (Size M)",        price:1800, category:"Clothing",    description:"University branded hoodie, navy blue. Worn twice, excellent cond.",           stock:5, image:null, emoji:"👕", seller:"amara_k",  tag:"New",        createdAt:"2026-02-05" },
  { id:"p4",  name:"Desk Lamp (LED)",               price:1200, category:"Dorm",        description:"Adjustable LED desk lamp. USB charging port on base.",                        stock:4, image:null, emoji:"💡", seller:"jane_s",   tag:null,         createdAt:"2026-02-07" },
  { id:"p5",  name:"Mini Fridge (14L)",             price:8900, category:"Dorm",        description:"Compact mini fridge, perfect for dorm room. Very quiet.",                    stock:1, image:null, emoji:"❄️", seller:"tobias_m", tag:"Limited",    createdAt:"2026-02-09" },
  { id:"p6",  name:"Chemistry Lab Coat",            price:950,  category:"Lab",         description:"White lab coat, size L. Required for CHEM101.",                              stock:6, image:null, emoji:"🥼", seller:"amara_k",  tag:null,         createdAt:"2026-02-11" },
  { id:"p7",  name:"Laptop Stand (Aluminium)",      price:2200, category:"Electronics", description:"Adjustable aluminium stand. Compatible with all laptops.",                   stock:8, image:null, emoji:"💻", seller:"mike_t",   tag:"Bestseller", createdAt:"2026-02-13" },
  { id:"p8",  name:"Coffee Maker (Single Serve)",   price:3400, category:"Dorm",        description:"Nespresso-compatible pod machine. Dorm-safe, auto shut-off.",                stock:2, image:null, emoji:"☕", seller:"tobias_m", tag:null,         createdAt:"2026-02-15" },
  { id:"p9",  name:"Biology Lab Manual",            price:650,  category:"Books",       description:"BIOL201 lab manual, current semester edition. No missing pages.",            stock:7, image:null, emoji:"🧬", seller:"priya_n",  tag:"New",        createdAt:"2026-02-17" },
  { id:"p10", name:"Noise-Cancelling Headphones",   price:7200, category:"Electronics", description:"Sony WH-1000XM4, great for studying in noisy dorms.",                        stock:1, image:null, emoji:"🎧", seller:"mike_t",   tag:"Hot",        createdAt:"2026-02-18" },
  { id:"p11", name:"Yoga Mat",                      price:1100, category:"Other",       description:"6mm non-slip yoga mat. Includes carry strap. Used twice.",                   stock:3, image:null, emoji:"🧘", seller:"amara_k",  tag:null,         createdAt:"2026-02-19" },
  { id:"p12", name:"USB-C Hub (7-in-1)",            price:2600, category:"Electronics", description:"7-port hub: HDMI, USB 3.0 x3, SD card, TF card, PD charging.",              stock:5, image:null, emoji:"🔌", seller:"priya_n",  tag:"Popular",    createdAt:"2026-02-20" },
];

/* ─── Products ───────────────────────────────────────────── */
export function getProducts(): Product[] {
  if (!isBrowser) return SEED;
  try {
    const raw = localStorage.getItem(KEYS.products);
    if (raw) return JSON.parse(raw) as Product[];
    localStorage.setItem(KEYS.products, JSON.stringify(SEED));
    return SEED;
  } catch { return SEED; }
}

export function saveProducts(products: Product[]): void {
  if (!isBrowser) return;
  try { localStorage.setItem(KEYS.products, JSON.stringify(products)); } catch {}
}

export function addProduct(p: Product): void {
  saveProducts([p, ...getProducts()]);
}

export function updateProduct(updated: Product): void {
  saveProducts(getProducts().map(p => p.id === updated.id ? updated : p));
}

export function deleteProduct(id: string): void {
  saveProducts(getProducts().filter(p => p.id !== id));
}

export function getProduct(id: string): Product | undefined {
  return getProducts().find(p => p.id === id);
}

/* ─── Cart ───────────────────────────────────────────────── */
export function getCart(): CartItem[] {
  if (!isBrowser) return [];
  try {
    const raw = localStorage.getItem(KEYS.cart);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch { return []; }
}

export function saveCart(cart: CartItem[]): void {
  if (!isBrowser) return;
  try { localStorage.setItem(KEYS.cart, JSON.stringify(cart)); } catch {}
}

export function addToCart(product: Product): void {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    saveCart(cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
  } else {
    saveCart([...cart, { ...product, qty: 1 }]);
  }
}

export function updateCartQty(id: string, delta: number): void {
  const cart = getCart();
  saveCart(cart.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
}

export function removeFromCart(id: string): void {
  saveCart(getCart().filter(i => i.id !== id));
}

export function clearCart(): void {
  saveCart([]);
}

export function cartCount(): number {
  return getCart().reduce((s, i) => s + i.qty, 0);
}

export function cartTotal(): number {
  return getCart().reduce((s, i) => s + i.price * i.qty, 0);
}

/* ─── Orders ─────────────────────────────────────────────── */
export function getOrders(): Order[] {
  if (!isBrowser) return [];
  try {
    const raw = localStorage.getItem(KEYS.orders);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch { return []; }
}

export function saveOrders(orders: Order[]): void {
  if (!isBrowser) return;
  try { localStorage.setItem(KEYS.orders, JSON.stringify(orders)); } catch {}
}

export function placeOrder(buyerName: string, phone: string, hostel: string): Order {
  const cart  = getCart();
  const order: Order = {
    id:     `ORD-${Date.now()}`,
    buyer:  buyerName,
    phone,
    hostel,
    items:  cart,
    total:  cartTotal(),
    status: "Pending",
    date:   new Date().toISOString().slice(0, 10),
  };
  saveOrders([order, ...getOrders()]);
  clearCart();
  return order;
}

/* ─── Utils ──────────────────────────────────────────────── */
export const ksh = (n: number) => `KSh ${n.toLocaleString()}`;

export const CATEGORIES = ["All", "Books", "Electronics", "Clothing", "Dorm", "Lab", "Other"];

export async function compressImage(file: File, maxW = 700, q = 0.78): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const scale  = Math.min(1, maxW / img.width);
        const canvas = document.createElement("canvas");
        canvas.width  = img.width  * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", q));
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}