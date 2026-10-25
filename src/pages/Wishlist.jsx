
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import BookCard from "../components/BookCard";
import { useWishlist } from "../context/WishlistContext";

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <main className="container catalog">
      <span className="eyebrow">SAVED FOR LATER</span>
      <h1>My Wishlist</h1>
      <p>Your favourite books, all in one place.</p>

      {wishlist.length ? (
        <div className="book-grid">
          {wishlist.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart size={40} />
          <h2>Your wishlist is waiting</h2>
          <p>Save books you would love to read.</p>
          <Link to="/books" className="btn">Explore Books</Link>
        </div>
      )}
    </main>
  );
}
