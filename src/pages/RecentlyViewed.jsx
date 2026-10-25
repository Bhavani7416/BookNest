
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import defaultBooks from "../data/books";

export default function RecentlyViewed() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function load() {
      const ids = JSON.parse(
        localStorage.getItem("booknest-recently-viewed") || "[]"
      );

      try {
        const res = await fetch("http://localhost:5000/api/books");
        if (!res.ok) throw new Error();

        const data = await res.json();
        const all = [
          ...defaultBooks,
          ...JSON.parse(localStorage.getItem("booknest-seller-books") || "[]"),
          ...data.map(b => ({ ...b, id: b._id, genre: b.category }))
        ];

        setBooks(ids.map(id =>
          all.find(b => String(b.id || b._id) === String(id))
        ).filter(Boolean));
      } catch (err) {
        console.error("Could not load recently viewed books", err);
      }
    }

    load();
  }, []);

  return (
    <main className="page-container">
      <h1>Recently Viewed Books</h1>
      <p>Continue exploring the books you viewed recently.</p>

      {!books.length ? (
        <p>No recently viewed books yet. <Link to="/books">Explore Books</Link></p>
      ) : (
        <div className="seller-book-grid">
          {books.map(book => (
            <Link
              to={`/book/${book.id || book._id}`}
              className="seller-book-card"
              key={book.id || book._id}
            >
              <img src={book.image} alt={book.title} />
              <div className="seller-book-info">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <strong>₹{book.price}</strong>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
