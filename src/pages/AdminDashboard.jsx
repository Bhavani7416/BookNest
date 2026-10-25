
import { useEffect, useState } from "react";
import { BookOpen, ShoppingBag, IndianRupee, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import books from "../data/books";

export default function AdminDashboard() {
  const [totalBooks, setTotalBooks] = useState(books.length);
  const orders = JSON.parse(localStorage.getItem("booknest-orders") || "[]");
  const revenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setTotalBooks(data.length))
      .catch(() => {});
  }, []);

  const stats = [
    ["Total Books", totalBooks, BookOpen],
    ["Total Orders", orders.length, ShoppingBag],
    ["Total Revenue", `₹${revenue}`, IndianRupee],
    ["Registered Users", localStorage.getItem("booknest-user-email") ? 1 : 0, Users]
  ];

  return (
    <main className="admin-page">
      <div className="admin-heading">
        <div>
          <p className="admin-eyebrow">BOOKNEST MANAGEMENT</p>
          <h1>Admin Dashboard</h1>
          <p>Monitor your bookstore activity at a glance.</p>
        </div>
        <Link to="/books" className="admin-view-link">
          View Store <ArrowRight size={17} />
        </Link>
      </div>

      <section className="admin-stats">
        {stats.map(([label, value, Icon]) => (
          <article className="admin-stat-card" key={label}>
            <span><Icon size={23} /></span>
            <p>{label}</p><h2>{value}</h2>
          </article>
        ))}
      </section>

      <section className="admin-orders">
        <div className="admin-section-heading">
          <h2>Recent Orders</h2>
          <Link to="/orders">View Orders →</Link>
        </div>

        {!orders.length ? (
          <div className="admin-empty">
            <ShoppingBag size={30} />
            <h3>No orders yet</h3>
            <p>Customer orders will appear here after checkout.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th><th>Customer</th><th>Date</th>
                  <th>Total</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[...orders].reverse().slice(0, 5).map(o => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.customer?.name || "Customer"}</td>
                    <td>{o.date || "—"}</td>
                    <td>₹{o.total}</td>
                    <td><span className="admin-status">
                      {o.status || "Order Placed"}
                    </span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
