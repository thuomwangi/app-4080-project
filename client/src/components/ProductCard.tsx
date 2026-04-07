import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();

  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md" aria-label={`${product.name}, ${product.condition}, $${product.price.toFixed(2)}`}>
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <img
            src={product.image}
            alt={`${product.name} — ${product.condition} condition, listed at KES${product.price.toFixed(2)}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.originalPrice && (
            <span className="absolute left-3 top-3 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground" aria-label="On sale">
              Sale
            </span>
          )}
          <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium text-foreground">
            {product.condition}
          </span>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="mb-1 text-sm font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="mb-2 text-xs text-muted-foreground">{product.location}</p>
        <div className="flex items-center gap-1 mb-2" aria-label={`Rating: ${product.rating} out of 5, ${product.reviews} reviews`}>
          <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden="true" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">Ksh {product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through" aria-label={`Original price $${product.originalPrice.toFixed(2)}`}>${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); addItem(product); }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
