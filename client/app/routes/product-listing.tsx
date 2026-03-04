export default function productListing() {
  return (
    <div className="container py-5">
    <h1 className="mb-4">Product Listing</h1>
      <p className="lead">
        This is a simple product listing page.
      </p>
      <a href="/" className="btn btn-outline-secondary">
        ← Back to Home
      </a>
            <a href="/products/1" className="btn btn-primary ms-2">
        View Product Detail
      </a>
    </div>
  );
}