import { Link } from "react-router-dom";


function NotFound() {
  return (
  <>
  <h1>404</h1>
  <h2>Page Not Found</h2>
  <p>Oops! The page you're looking for doesn't exist.</p>
  <Link to="/dashboard" replace>Go to Dashboard</Link>
  </>
  )
}

export default NotFound;
