import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),        
    route("sign-up", "routes/sign-up.tsx"),    
    route("products", "routes/product-listing.tsx"),
    route("products/:id", "routes/product-detail.tsx"),
    route("seller-dashboard", "routes/seller-dashboard.tsx"),

    //catches error 404 
    route("*", "routes/not-found.tsx"),

] satisfies RouteConfig;
