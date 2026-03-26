import React, { useState } from "react";

export default function ProductDetail() {

  const products = [
    {
      image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3",
      price: 4500
    },
    {
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
      price: 5200
    },
    {
      image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa",
      price: 3900
    },
    {
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      price: 6100
    }
  ];

  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  return (
    <div className="container py-5">

      {/* Breadcrumb */}
      <nav className="mb-4 text-muted">
        Home / Products / <strong>Laptop Backpack</strong>
      </nav>

      <div className="row g-5">

        {/* LEFT SIDE */}
        <div className="col-md-6">

          {/* Main Image */}
          <div className="border rounded shadow-sm bg-light p-3 text-center">

            <img
              src={selectedProduct.image}
              alt="Product"
              className="img-fluid"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain"
              }}
            />

          </div>

          {/* Thumbnails */}
          <div className="d-flex gap-3 mt-3 flex-wrap">

            {products.map((product, index) => (
              <img
                key={index}
                src={product.image}
                alt="thumbnail"
                width={85}
                height={85}
                className="rounded border"
                style={{
                  cursor: "pointer",
                  objectFit: "cover"
                }}
                onClick={() => setSelectedProduct(product)}
              />
            ))}

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-6">

          <h2 className="mb-2">Laptop Backpack</h2>

          {/* Rating */}
          <div className="text-warning mb-2">
            ★★★★☆ <span className="text-muted">(120 reviews)</span>
          </div>

          {/* PRICE IN KES */}
          <h4 className="text-primary">
            KES {selectedProduct.price.toLocaleString()}
          </h4>

          {/* Stock */}
          <p className="text-success mt-2">In Stock</p>

          {/* Description */}
          <p className="text-muted mt-3">
            Durable backpack perfect for students. Water resistant with
            multiple compartments for laptops and books. Designed for comfort,
            style, and everyday use.
          </p>

          {/* Quantity */}
          <div className="mt-4">

            <label className="form-label">Quantity</label>

            <input
              type="number"
              defaultValue={1}
              min={1}
              className="form-control"
              style={{ width: "120px" }}
            />

          </div>

          {/* Buttons */}
          <div className="mt-4 d-flex gap-3">

            <button className="btn btn-primary px-4">
              Add to Cart
            </button>

            <button className="btn btn-outline-secondary">
              Buy Now
            </button>

          </div>

        </div>

      </div>

      {/* Product Details */}
      <div className="mt-5">

        <h4>Product Details</h4>

        <ul className="text-muted mt-3">
          <li>Fits laptops up to 15 inches</li>
          <li>Water-resistant material</li>
          <li>Multiple compartments</li>
          <li>Comfortable padded straps</li>
          <li>Lightweight and durable design</li>
        </ul>

      </div>

    </div>
  );
}