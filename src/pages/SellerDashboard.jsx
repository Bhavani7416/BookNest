
import { useEffect, useState } from "react";
import { Store, Plus, Trash2, BookOpen, Pencil } from "lucide-react";

const API = "http://localhost:5000/api/books";
const emptyForm = { title: "", author: "", genre: "Fiction", price: "", image: "" };

export default function SellerDashboard() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  async function loadBooks() {
    try {
      const r = await fetch(API);
      if (!r.ok) throw new Error();
      setBooks((await r.json()).map(b => ({
        ...b, id: b._id, genre: b.category || b.genre || "Fiction"
      })));
    } catch {
      setMessage("Could not load books from MongoDB.");
    }
  }

  useEffect(() => { loadBooks(); }, []);

  const orders = JSON.parse(localStorage.getItem("booknest-orders") || "[]");
  const ids = new Set(books.map(b => b.id));
  const sales = orders.flatMap(o => (o.items || [])
    .filter(i => ids.has(i.id || i._id))
    .map(i => ({ ...i, orderId: o.id, date: o.date })));
  const sold = sales.reduce((s, i) => s + Number(i.quantity || 0), 0);
  const earnings = sales.reduce(
    (s, i) => s + Number(i.price || 0) * Number(i.quantity || 0), 0
  );

  async function saveBook(e) {
    e.preventDefault();
    const editing = Boolean(editingId);

    try {
      const r = await fetch(editing ? `${API}/${editingId}` : API, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form, category: form.genre, price: Number(form.price)
        })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "Could not save book.");

      setForm(emptyForm);
      setEditingId(null);
      setMessage(editing ? "Book updated successfully!" : "Book listing added successfully!");
      await loadBooks();
    } catch (err) {
      setMessage(err.message || "Could not connect to the server.");
    }
  }

  async function deleteBook(id) {
    if (!window.confirm("Remove this book listing?")) return;
    try {
      const r = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Could not delete book.");
      if (editingId === id) {
        setForm(emptyForm);
        setEditingId(null);
      }
      setMessage("Book listing removed.");
      await loadBooks();
    } catch (err) {
      setMessage(err.message);
    }
  }

  function editBook(b) {
    setForm({
      title: b.title, author: b.author, genre: b.genre,
      price: String(b.price), image: b.image || ""
    });
    setEditingId(b.id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const stats = [
    ["Total Listings", books.length],
    ["Books Sold", sold],
    ["Total Earnings", `₹${earnings}`]
  ];

  return (
    <main className="seller-page">
      <header className="seller-heading">
        <span><Store size={28} /></span>
        <div><h1>Seller Dashboard</h1><p>Add books and manage your store listings.</p></div>
      </header>

      <section className="seller-summary">
        <BookOpen size={24} /><div><p>Your Listed Books</p><h2>{books.length}</h2></div>
      </section>

      <section className="seller-stats">
        {stats.map(([label, value]) => (
          <div className="seller-summary" key={label}>
            <BookOpen size={24} /><div><p>{label}</p><h2>{value}</h2></div>
          </div>
        ))}
      </section>

      <section className="seller-form-card">
        <h2><Plus size={21} /> {editingId ? "Edit Book" : "Add a New Book"}</h2>
        <form onSubmit={saveBook} className="seller-form">
          <label>Book Title
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Enter book title" required />
          </label>
          <label>Author
            <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })}
              placeholder="Enter author name" required />
          </label>
          <label>Genre
            <select value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })}>
              {["Fiction", "Technology", "Self Growth", "Lifestyle", "Education", "Biography"]
                .map(g => <option key={g}>{g}</option>)}
            </select>
          </label>
          <label>Price (₹)
            <input type="number" min="1" value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              placeholder="Enter price" required />
          </label>
          <label className="seller-full-width">Book Cover Image URL
            <input type="url" value={form.image}
              onChange={e => setForm({ ...form, image: e.target.value })}
              placeholder="https://example.com/book-cover.jpg" required />
          </label>
          <button type="submit">{editingId ? "Update Book" : "Add Book Listing"}</button>
          {editingId && <button type="button" onClick={() => {
            setForm(emptyForm); setEditingId(null); setMessage("");
          }}>Cancel Edit</button>}
        </form>
        {message && <p className="seller-message">{message}</p>}
      </section>

      <section className="seller-listings">
        <h2>Recent Sales</h2>
        {!sales.length ? <p className="seller-empty">No sales yet. Your sold books will appear here.</p>
          : sales.slice(0, 5).map((i, n) => (
            <div className="checkout-item" key={`${i.orderId}-${i.id}-${n}`}>
              <span>{i.title} × {i.quantity}<br />Order #{i.orderId} · {i.date}</span>
              <strong>₹{Number(i.price) * Number(i.quantity || 0)}</strong>
            </div>
          ))}
      </section>

      <section className="seller-listings">
        <h2>My Listings</h2>
        {!books.length ? <p className="seller-empty">No listings yet. Add your first book above.</p>
          : <div className="seller-book-grid">
            {books.map(b => (
              <article className="seller-book-card" key={b.id}>
                <img src={b.image} alt={b.title} />
                <div className="seller-book-info">
                  <h3>{b.title}</h3><p>{b.author}</p>
                  <span>{b.genre}</span><strong>₹{b.price}</strong>
                  <button type="button" onClick={() => editBook(b)}><Pencil size={16} /> Edit Listing</button>
                  <button type="button" className="seller-delete" onClick={() => deleteBook(b.id)}>
                    <Trash2 size={16} /> Remove Listing
                  </button>
                </div>
              </article>
            ))}
          </div>}
      </section>
    </main>
  );
}
