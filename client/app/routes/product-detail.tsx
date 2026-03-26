import { useParams, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { getProducts, addToCart, type Product } from "../lib/store";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const found = getProducts().find((p) => p.id === id);
    if (found) setProduct(found);
  }, [id]);

  if (!product) return <div className="p-5 text-center"><h3>Product not found</h3></div>;

  return (
    <div className="container py-5">
      <div className="row g-5">
        <div className="col-md-6">
          <div className="rounded-4 overflow-hidden shadow-sm border" style={{ height: "450px" }}>
            <img src={product.image} className="w-100 h-100" style={{ objectFit: "cover" }} alt={product.name} />
          </div>
        </div>
        <div className="col-md-6">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/products">Marketplace</Link></li>
              <li className="breadcrumb-item active">{product.category}</li>
            </ol>
          </nav>
          <h1 className="display-5 fw-bold mb-3">{product.name}</h1>
          <h2 className="text-primary fw-bold mb-4">KES {product.price.toLocaleString()}</h2>
          <hr />
          <p className="text-muted lh-lg mb-5">{product.description}</p>
          <div className="d-grid gap-3">
            <button className="btn btn-primary btn-lg py-3 rounded-pill fw-bold" onClick={() => {addToCart(product); navigate('/checkout');}}>Buy Now</button>
            <button className="btn btn-outline-dark btn-lg py-3 rounded-pill fw-bold" onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}