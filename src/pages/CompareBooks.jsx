
import { useEffect, useState } from "react";
import { ArrowLeftRight, X } from "lucide-react";

export default function CompareBooks() {
  const [books, setBooks] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load books");
        return r.json();
      })
      .then(setBooks)
      .catch(console.error);
  }, []);

  const toggleBook = (id) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length < 3 ? [...current, id] : current
    );

  const compared = books.filter((b) => selected.includes(b._id || b.id));
  const fields = [
    ["Cover", (b) => <img className="compare-cover" src={b.image} alt={b.title} />],
    ["Author", (b) => b.author],
    ["Genre", (b) => b.category || b.genre],
    ["Price", (b) => `₹${b.price}`],
  ];

  return (
    <main className="compare-page">
      <div className="compare-heading">
        <span><ArrowLeftRight size={25} /></span>
        <div><h1>Compare Books</h1><p>Select up to 3 books to compare their details.</p></div>
      </div>

      <section className="compare-selector">
        {books.map((b) => {
          const id = b._id || b.id;
          const active = selected.includes(id);
          return (
            <button key={id} className={`compare-option ${active ? "selected" : ""}`}
              onClick={() => toggleBook(id)} disabled={!active && selected.length === 3}>
              {active ? "✓ " : "+ "}{b.title}
            </button>
          );
        })}
      </section>

      {!compared.length ? (
        <p className="compare-empty">Select books above to see a side-by-side comparison.</p>
      ) : (
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead><tr><th>Details</th>{compared.map((b) => (
              <th key={b._id || b.id}><div className="compare-book-title">{b.title}
                <button aria-label={`Remove ${b.title}`} onClick={() => toggleBook(b._id || b.id)}><X size={16} /></button>
              </div></th>
            ))}</tr></thead>
            <tbody>{fields.map(([label, render]) => (
              <tr key={label}><td>{label}</td>{compared.map((b) => (
                <td key={b._id || b.id}>{render(b)}</td>
              ))}</tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </main>
  );
}
