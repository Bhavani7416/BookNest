
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingBag, Star } from "lucide-react";
import defaultBooks from "../data/books";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const key = `booknest-reviews-${id}`;

  useEffect(() => {
    async function loadBook() {
      try {
        const res = await fetch(`http://localhost:5000/api/books/${id}`);
        if (!res.ok) throw new Error();
        const b = await res.json();
        setBook({ ...b, id: b._id, genre: b.category || "Other" });
      } catch {
        const books = [
          ...defaultBooks,
          ...JSON.parse(localStorage.getItem("booknest-seller-books") || "[]")
        ];
        setBook(books.find(b => String(b.id) === id) || null);
      }
    }

    loadBook();
    setReviews(JSON.parse(localStorage.getItem(key) || "[]"));
  }, [id, key]);

  useEffect(() => {
    if (!book) return;
    const k = "booknest-recently-viewed";
    const old = JSON.parse(localStorage.getItem(k) || "[]");
    localStorage.setItem(k, JSON.stringify([
      book.id, ...old.filter(x => x !== book.id)
    ].slice(0, 4)));
  }, [book]);

  if (!book) return (
    <main className="page-container">
      <h2>Book not found</h2>
      <Link to="/books">Back to Books</Link>
    </main>
  );

  const saved = wishlist.some(b => String(b.id || b._id) === String(book.id));
  const average = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  function submitReview(e) {
    e.preventDefault();
    const updated = [{
      id: Date.now(), rating, text: reviewText.trim(),
      date: new Date().toLocaleDateString()
    }, ...reviews];
    setReviews(updated);
    localStorage.setItem(key, JSON.stringify(updated));
    setReviewText("");
    setRating(5);
  }

  return (
    <main className="details-page">
      <Link to="/books" className="back-link">
        <ArrowLeft size={17} /> Back to Books
      </Link>

      <section className="details-card">
        <img className="details-cover" src={book.image} alt={book.title} />
        <div className="details-info">
          <span className="book-genre">{book.genre || book.category}</span>
          <h1>{book.title}</h1>
          <p className="book-author">by {book.author}</p>
          <p className="details-rating">
            <Star size={18} fill="#F5B942" color="#F5B942" />
            {average ? `${average} / 5 (${reviews.length} reviews)` : "No reviews yet"}
          </p>
          <h2 className="details-price">₹{book.price}</h2>
          <p>{book.description || "Discover this book and add it to your personal reading collection. Explore the details and share your review."}</p>
          <div className="detail-actions">
            <button className="btn" onClick={() => addToCart(book)}>
              <ShoppingBag size={17} /> Add to Cart
            </button>
            <button className="wishlist-btn" onClick={() => toggleWishlist(book)}>
              <Heart size={18} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Wishlist"}
            </button>
          </div>
        </div>
      </section>

      <section className="reviews-section">
        <span className="eyebrow">READER FEEDBACK</span>
        <h2>Ratings & Reviews</h2>
        <p>What do you think about this book?</p>

        <form className="review-form" onSubmit={submitReview}>
          <label>Your Rating</label>
          <div className="rating-picker">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} type="button" aria-label={`${n} stars`}
                onClick={() => setRating(n)} className="rating-star">
                <Star size={28} fill={n <= rating ? "#F5B942" : "none"} color="#F5B942" />
              </button>
            ))}
            <span>{rating} / 5</span>
          </div>
          <label htmlFor="reviewText">Your Review</label>
          <textarea id="reviewText" value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            placeholder="Share your thoughts about this book..."
            minLength={3} maxLength={500} required />
          <button className="btn" type="submit">Submit Review</button>
        </form>

        <div className="reviews-list">
          {!reviews.length ? <p>No reviews yet. Be the first to review this book!</p>
            : reviews.map(r => (
              <article className="review-card" key={r.id}>
                <div className="review-card-top">
                  <strong>BookNest Reader</strong><span>{r.date}</span>
                </div>
                <div className="review-stars">
                  {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  <span>{r.rating}/5</span>
                </div>
                <p>{r.text}</p>
              </article>
            ))}
        </div>
      </section>
    </main>
  );
}
