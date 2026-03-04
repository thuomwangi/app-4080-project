export default function productDetail() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Product Detail</h1>
      <div className="alert alert-info">
        This is a simple product detail page.
      </div>
      <a href="/products" className="btn btn-outline-secondary">
        ← Back to Product Listing
      </a>
    </div>
  );
}
