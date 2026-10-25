
import { Link } from "react-router-dom";
import { BookOpen, Search, ShoppingBag, Heart } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="logo-icon"><BookOpen /></span>
        BookNest
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/books">Explore Books</Link>
        <Link to="/orders">My Orders</Link>
        <Link to="/reading-shelf">Reading Shelf</Link>
        <Link to="/profile">My Profile</Link>
        <Link to="/compare">Compare Books</Link>
        <Link to="/seller">Seller Centre</Link>
      </div>

      <div className="nav-actions">
        <Link to="/books" aria-label="Search books"><Search /></Link>
        <Link to="/wishlist" aria-label="Wishlist"><Heart /></Link>
        <Link to="/cart" aria-label="Shopping cart"><ShoppingBag /></Link>
        <Link to="/login" className="login-btn">Login</Link>
      </div>
    </nav>
  );
}
