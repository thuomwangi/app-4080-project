import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Heart, MessageCircle, Star, ChevronRight, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products as staticProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useListings } from "@/context/ListingsContext";
import { useState } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const { userListings } = useListings();
  const allProducts = [...userListings, ...staticProducts];
  const product = allProducts.find((p) => p.id === id);
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <Link to="/products" className="text-primary hover:underline">Back to Products</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main id="main-content" className="container mx-auto px-4 py-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <Link to="/products" className="hover:text-primary">Products</Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <span className="text-foreground" aria-current="page">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Images */}
          <div>
            <div className="mb-4 aspect-square overflow-hidden rounded-xl border border-border bg-secondary">
              <img
                src={product.images[selectedImage]}
                alt={`${product.name} — ${product.condition} condition, main product view ${selectedImage + 1} of ${product.images.length}`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex gap-3" role="group" aria-label="Product image thumbnails">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors ${i === selectedImage ? 'border-primary' : 'border-border'}`}
                  aria-label={`View image ${i + 1} of ${product.images.length}`}
                  aria-pressed={i === selectedImage}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{product.category}</span>
            <h1 className="mb-2 text-2xl font-bold md:text-3xl">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4" aria-label={`Rating: ${product.rating} out of 5, ${product.reviews} reviews, condition: ${product.condition}`}>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" aria-hidden="true" />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
              <span className="text-sm text-muted-foreground">• {product.condition}</span>
            </div>

            <div className="mb-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary" aria-label={`Price: KES${product.price.toFixed(2)}`}>${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through" aria-label={`Original price: $${product.originalPrice.toFixed(2)}`}>${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="mb-6 text-muted-foreground">{product.description}</p>

            <div className="mb-6 rounded-xl border border-border p-4">
              <h2 className="mb-3 text-sm font-semibold">Specifications</h2>
              <dl className="grid grid-cols-2 gap-2">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="text-sm font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mb-6 flex items-center gap-3 rounded-xl border border-border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground" aria-hidden="true">
                {product.sellerAvatar}
              </div>
              <div>
                <p className="text-sm font-semibold">{product.seller}</p>
                <p className="text-xs text-muted-foreground">{product.location}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => addItem(product)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                aria-label={`Add ${product.name} to cart, KES${product.price.toFixed(2)}`}
              >
                <ShoppingCart className="h-5 w-5" aria-hidden="true" /> Add to Cart
              </button>
              <Link
                to="/checkout"
                onClick={() => addItem(product)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-primary px-6 py-3 font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label={`Buy ${product.name} now for KES${product.price.toFixed(2)}`}
              >
                Buy Now
              </Link>
              <button
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-border hover:bg-secondary transition-colors"
                aria-label={`Add ${product.name} to wishlist`}
              >
                <Heart className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <Link
              to={`/support/create?product=${encodeURIComponent(product.name)}`}
              className="mt-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              <AlertTriangle className="h-4 w-4" aria-hidden="true" /> Report Issue with this Product
            </Link>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="related-heading">
            <h2 id="related-heading" className="mb-6 text-xl font-bold">You May Also Like</h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </main>

      {/* Chat with Seller FAB */}
      <button
        className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors z-40"
        aria-label={`Chat with seller ${product.seller}`}
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" /> Chat with Seller
      </button>

      <Footer />
    </div>
  );
};

export default ProductDetail;
