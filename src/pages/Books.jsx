
import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import books from "../data/books";

export default function Books() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("default");
  const [apiBooks, setApiBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(data => setApiBooks(data.map(b => ({
        ...b, id: b._id, genre: b.category || b.genre || "Other"
      }))))
      .catch(() => setApiError("Could not load database books. Please check the backend server."))
      .finally(() => setLoading(false));
  }, []);

  const sellerBooks = JSON.parse(localStorage.getItem("booknest-seller-books") || "[]");
  const combined = [...books, ...sellerBooks, ...apiBooks];

  const allBooks = combined.filter((b, i, arr) =>
    arr.findIndex(x =>
      `${x.title}-${x.author}`.toLowerCase() ===
      `${b.title}-${b.author}`.toLowerCase()
    ) === i
  );

  const genres = ["All", ...new Set(allBooks.map(b => b.genre || "Other"))];

  const filtered = allBooks
    .filter(b =>
      `${b.title} ${b.author} ${b.genre || "Other"}`.toLowerCase().includes(search.toLowerCase()) &&
      (genre === "All" || (b.genre || "Other") === genre)
    )
    .sort((a, b) =>
      sort === "price-low" ? a.price - b.price :
      sort === "price-high" ? b.price - a.price :
      sort === "title" ? a.title.localeCompare(b.title) : 0
    );

  function clearFilters() {
    setSearch("");
    setGenre("All");
    setSort("default");
  }

  return (
    <main className="container books-page">
      <div className="section-heading">
        <span className="eyebrow">THE BOOK COLLECTION</span>
        <h1>Explore Books</h1>
        <p>Find your next favourite read.</p>
      </div>

      <div className="book-filters">
        <input className="search-input" type="search"
          placeholder="Search title, author or genre..."
          value={search} onChange={e => setSearch(e.target.value)} />

        <select value={genre} onChange={e => setGenre(e.target.value)} aria-label="Filter by genre">
          {genres.map(g => <option key={g} value={g}>{g === "All" ? "All Genres" : g}</option>)}
        </select>

        <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort books">
          <option value="default">Sort By</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="title">Title: A to Z</option>
        </select>
      </div>

      <p className="results-count">{filtered.length} books found</p>
      {loading && <p>Loading database books...</p>}
      {!loading && apiError && <p role="alert">{apiError}</p>}

      {filtered.length ? (
        <div className="book-grid">
          {filtered.map((book, i) =>
            <BookCard key={book.id || book._id || `${book.title}-${i}`} book={book} />
          )}
        </div>
      ) : !loading && (
        <div className="empty-state">
          <h2>No books found</h2>
          <p>Try another search or select a different genre.</p>
          <button className="btn" onClick={clearFilters}>Clear Filters</button>
        </div>
      )}
    </main>
  );
}
