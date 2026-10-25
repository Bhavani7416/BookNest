
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import BookCard from "../components/BookCard";
import defaultBooks from "../data/books";
import { useState } from "react";

export default function Home() {
  const [recentIds] = useState(() =>
    JSON.parse(localStorage.getItem("booknest-recently-viewed") || "[]")
  );

  const sellerBooks = JSON.parse(
    localStorage.getItem("booknest-seller-books") || "[]"
  );

  const allBooks = [...defaultBooks, ...sellerBooks];

  const recentBooks = recentIds
    .map(id => allBooks.find(book => book.id === id))
    .filter(Boolean);

  return (
    <main className="container">
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">
            <Sparkles size={15} /> YOUR NEXT CHAPTER STARTS HERE
          </span>
          <h1>Find stories<br />that stay with you.</h1>
          <p>
            Discover inspiring reads, timeless classics and fresh ideas
            from a world of booksellers.
          </p>
          <Link to="/books" className="btn">
            Explore Books <ArrowRight size={18} />
          </Link>
          <div className="hero-note">
            <BookOpen size={18} />
            Your next favourite book is waiting.
          </div>
        </div>

        <div className="hero-art">
          <div className="art-glow"></div>
          <div className="book-stack">
            <div className="stack-book stack-one">
              <span>THE ART OF<br />SLOW LIVING</span>
            </div>
            <div className="stack-book stack-two">
              <BookOpen size={30} />
              <span>NEW<br />CHAPTERS</span>
            </div>
            <div className="stack-book stack-three">
              <span>IMAGINE<br />MORE.</span>
            </div>
          </div>
          <span className="floating-note">Read. Discover. Repeat.</span>
        </div>
      </section>

      <section className="section" id="featured">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A LITTLE INSPIRATION</span>
            <h2>Featured Books</h2>
            <p>Handpicked reads for your next quiet moment.</p>
          </div>
          <Link to="/books" className="text-link">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="book-grid">
          {allBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {recentBooks.length > 0 && (
        <section className="section recent-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PICK UP WHERE YOU LEFT OFF</span>
              <h2>Recently Viewed</h2>
              <p>Books you've explored recently.</p>
            </div>
            <Link to="/books" className="text-link">
              Explore all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="book-grid">
            {recentBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

      <section className="reading-banner" id="reading">
        <div>
          <span className="eyebrow">MAKE READING A HABIT</span>
          <h2>Your next chapter starts with one page.</h2>
          <p>Keep your favourite reads together in your personal shelf.</p>
        </div>
        <Link to="/reading-shelf" className="btn light-btn">
          My Reading Shelf <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}
