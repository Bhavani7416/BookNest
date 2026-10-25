
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import books from "../data/books";

const KEY = "booknest-reading-shelf";
const API = "http://localhost:5000/api";

export default function ReadingShelf() {
  const [shelf, setShelf] = useState(() =>
    JSON.parse(localStorage.getItem(KEY) || "{}")
  );
  const [allBooks, setAllBooks] = useState(books);
  const token = localStorage.getItem("booknest-token");

  useEffect(() => {
    fetch(`${API}/books`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setAllBooks(old => {
        const merged = [...old, ...data.map(b => ({
          ...b, id: b._id, genre: b.category || b.genre
        }))];
        return merged.filter((b, i) =>
          merged.findIndex(x => x.id === b.id || x._id === b._id) === i
        );
      }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/shelf`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const saved = {};
        (data.books || []).forEach(({ book, status, progress }) => {
          if (book) saved[book._id] = { status, progress };
        });
        setShelf(saved);
        localStorage.setItem(KEY, JSON.stringify(saved));
      })
      .catch(() => {});
  }, []);

  function save(data) {
    setShelf(data);
    localStorage.setItem(KEY, JSON.stringify(data));

    if (token) {
      const items = Object.entries(data)
        .filter(([id]) => /^[a-f\d]{24}$/i.test(id))
        .map(([book, value]) => ({ book, ...value }));

      fetch(`${API}/shelf`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ books: items })
      }).catch(console.error);
    }
  }

  function update(id, changes) {
    save({
      ...shelf,
      [id]: {
        status: "Want to Read", progress: 0,
        ...shelf[id], ...changes
      }
    });
  }

  const shelfBooks = allBooks.filter(b => shelf[b.id || b._id]);

  return (
    <main className="container reading-shelf-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR PERSONAL LIBRARY</span>
          <h1>My Reading Shelf</h1>
          <p>Organize your books and track your reading journey.</p>
        </div>
      </div>

      <div className="shelf-add">
        <label htmlFor="add-book">Add a book to your shelf</label>
        <select id="add-book" defaultValue="" onChange={e => {
          if (e.target.value) update(e.target.value, {});
          e.target.value = "";
        }}>
          <option value="" disabled>Select a book</option>
          {allBooks.filter(b => !shelf[b.id || b._id]).map(b =>
            <option key={b.id || b._id} value={b.id || b._id}>
              {b.title}
            </option>
          )}
        </select>
      </div>

      {!shelfBooks.length ? (
        <div className="empty-state">
          <h2>Your shelf is waiting</h2>
          <p>Add books above to start tracking your reading.</p>
          <Link to="/books" className="btn">Explore Books</Link>
        </div>
      ) : (
        <div className="shelf-list">
          {shelfBooks.map(book => {
            const id = book.id || book._id;
            const item = shelf[id];
            const { status, progress = 0 } = item;

            return (
              <article className="shelf-card" key={id}>
                {book.image && <img src={book.image} alt={book.title} />}
                <div className="shelf-info">
                  <span className="book-genre">
                    {book.genre || book.category}
                  </span>
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>

                  <label htmlFor={`status-${id}`}>Reading Status</label>
                  <select id={`status-${id}`} value={status}
                    onChange={e => {
                      const next = e.target.value;
                      update(id, {
                        status: next,
                        progress: next === "Completed" ? 100 :
                          status === "Completed" ? 0 : progress
                      });
                    }}>
                    <option>Want to Read</option>
                    <option>Currently Reading</option>
                    <option>Completed</option>
                  </select>

                  {status !== "Completed" && (
                    <div className="progress-control">
                      <label htmlFor={`progress-${id}`}>
                        Reading Progress: {progress}%
                      </label>
                      <input id={`progress-${id}`} type="range"
                        min="0" max="100" step="10" value={progress}
                        onChange={e => {
                          const progress = Number(e.target.value);
                          update(id, {
                            progress,
                            status: progress === 100
                              ? "Completed" : "Currently Reading"
                          });
                        }} />
                    </div>
                  )}

                  <button className="shelf-remove" onClick={() => {
                    const data = { ...shelf };
                    delete data[id];
                    save(data);
                  }}>Remove from shelf</button>

                  <Link to={`/book/${id}`}>View Book</Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
