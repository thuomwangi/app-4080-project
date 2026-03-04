export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="lead mb-5">
        The page you're looking for doesn't exist.
      </p>
      <a href="/" className="btn btn-primary btn-lg px-5">
        Go Home
      </a>
    </div>
  );
}