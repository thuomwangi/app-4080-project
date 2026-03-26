import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    // Landing Page
    index("routes/home.tsx"),
    
    // Marketplace Flow
    route("products", "routes/product-listing.tsx"),
    route("products/:id", "routes/product-detail.tsx"),
    route("checkout", "routes/checkout.tsx"), // Added Checkout Route
    
    // Seller Flow
    route("seller-dashboard", "routes/seller-dashboard.tsx"),
    
    // User Authentication
    route("sign-up", "routes/sign-up.tsx"),
    route("login", "routes/login.tsx"), 

    // 404 Catch-all
    route("*", "routes/not-found.tsx"),

] satisfies RouteConfig;