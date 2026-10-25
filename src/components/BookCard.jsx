
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen } from "lucide-react";

export default function BookCard({ book }) {
  const [imageError, setImageError] = useState(false);

  const bookId = book.id || book._id;
  const imageUrl = book.image?.trim();

  return (
    <article className="book-card">
      <Link to={`/book/${bookId}`} className="book-cover">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={`${book.title} book cover`}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="book-cover-placeholder">
            <BookOpen size={42} />
            <span>{book.title}</span>
          </div>
        )}
      </Link>

      <span className="book-genre">
        {book.genre || book.category || "Other"}
      </span>

      <h3>{book.title}</h3>
      <p className="book-author">{book.author}</p>

      <div className="book-bottom">
        <strong>₹{book.price}</strong>

        <Link to={`/book/${bookId}`} className="view-book">
          View <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
