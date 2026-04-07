import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products as staticProducts, categories } from "@/data/products";
import { useListings } from "@/context/ListingsContext";

const conditions = ["New", "Like New", "Good", "Fair"];
const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low", "Most Popular"];

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [sort, setSort] = useState("Newest");
  const [showFilters, setShowFilters] = useState(false);
  const { userListings } = useListings();
  const products = [...userListings, ...staticProducts];

  let filtered = products.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (selectedCondition && p.condition !== selectedCondition) return false;
    return true;
  });

  if (sort === "Price: Low to High") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === "Price: High to Low") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === "Most Popular") filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);

  const Filters = () => (
    <fieldset className="space-y-6">
      <legend className="sr-only">Product filters</legend>
      <div role="group" aria-labelledby="filter-category">
        <h3 id="filter-category" className="mb-3 text-sm font-semibold">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="radio" name="cat" checked={!selectedCategory} onChange={() => setSelectedCategory("")} className="accent-[hsl(var(--primary))]" />
            All Categories
          </label>
          {categories.map((c) => (
            <label key={c.name} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="cat" checked={selectedCategory === c.name} onChange={() => setSelectedCategory(c.name)} className="accent-[hsl(var(--primary))]" />
              {c.name}
            </label>
          ))}
        </div>
      </div>
      <div role="group" aria-labelledby="filter-condition">
        <h3 id="filter-condition" className="mb-3 text-sm font-semibold">Condition</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="radio" name="cond" checked={!selectedCondition} onChange={() => setSelectedCondition("")} className="accent-[hsl(var(--primary))]" />
            Any
          </label>
          {conditions.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="cond" checked={selectedCondition === c} onChange={() => setSelectedCondition(c)} className="accent-[hsl(var(--primary))]" />
              {c}
            </label>
          ))}
        </div>
      </div>
    </fieldset>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">All Products</h1>
            <p className="text-sm text-muted-foreground" aria-live="polite">{filtered.length} products found</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm md:hidden"
              aria-expanded={showFilters}
              aria-controls="sidebar-filters"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Filters
            </button>
            <div>
              <label htmlFor="sort-select" className="sr-only">Sort products by</label>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              >
                {sortOptions.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <aside id="sidebar-filters" className={`w-60 shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`} aria-label="Product filters">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
              <h2 className="mb-4 text-sm font-bold">Filters</h2>
              <Filters />
            </div>
          </aside>

          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            {filtered.length === 0 && (
              <div className="py-20 text-center text-muted-foreground" role="status">No products match your filters.</div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductListing;
