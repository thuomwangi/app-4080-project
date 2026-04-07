import { Link } from "react-router-dom";
import { Monitor, Sofa, BookOpen, Shirt, Lightbulb, Dumbbell, ArrowRight, ShoppingBag, Store } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import heroBg from "@/assets/hero-bg.jpg";

const iconMap: Record<string, React.ElementType> = {
  Monitor, Sofa, BookOpen, Shirt, Lightbulb, Dumbbell,
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden" aria-label="Hero banner">
          <div className="absolute inset-0">
            <img src={heroBg} alt="University student carrying a box of items to sell on CampusCart marketplace" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
          </div>
          <div className="relative container mx-auto px-4 py-24 md:py-32">
            <div className="max-w-xl">
              <h1 className="mb-4 text-4xl font-bold leading-tight text-background md:text-5xl">
                Discover &amp; Sell Campus Treasures
              </h1>
              <p className="mb-8 text-lg text-background/90">
                Your one-stop marketplace for campus essentials. Buy and sell with fellow students safely and easily.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Shop Now <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/post-item"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-background/30 bg-background/10 px-6 py-3 font-semibold text-background hover:bg-background/20 backdrop-blur transition-colors"
                >
                  Start Selling
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-section py-16" aria-labelledby="categories-heading">
          <div className="container mx-auto px-4">
            <h2 id="categories-heading" className="mb-8 text-center text-2xl font-bold">Explore Categories</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6" role="list">
              {categories.map((cat) => {
                const Icon = iconMap[cat.icon];
                return (
                  <Link
                    key={cat.name}
                    to={`/products?category=${cat.name}`}
                    className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                    role="listitem"
                    aria-label={`${cat.name} category, ${cat.count} items available`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-semibold">{cat.name}</span>
                    <span className="text-xs text-muted-foreground">{cat.count} items</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16" aria-labelledby="featured-heading">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 id="featured-heading" className="text-2xl font-bold">Featured Products</h2>
              <Link to="/products" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Trust / CTA */}
        <section className="bg-section py-16" aria-labelledby="cta-heading">
          <div className="container mx-auto px-4 text-center">
            <h2 id="cta-heading" className="mb-3 text-2xl font-bold">CampusCart: Connect. Buy. Sell.</h2>
            <p className="mx-auto mb-10 max-w-md text-muted-foreground">
              Join thousands of students buying and selling on campus. Whether you're a buyer or seller, we've got you covered.
            </p>
            <div className="mx-auto grid max-w-2xl gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShoppingBag className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">For Buyers</h3>
                <p className="mb-4 text-sm text-muted-foreground">Find great deals on campus essentials from fellow students.</p>
                <Link to="/products" className="inline-flex rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  Browse Products
                </Link>
              </div>
              <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Store className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">For Sellers</h3>
                <p className="mb-4 text-sm text-muted-foreground">Turn your unused items into cash. Reach buyers instantly.</p>
                <Link to="/post-item" className="inline-flex rounded-lg border border-primary px-5 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                  Start Selling
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
