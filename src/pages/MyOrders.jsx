
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:5000/api/orders";
const KEY = "booknest-orders";
const read = () => JSON.parse(localStorage.getItem(KEY) || "[]");

export default function MyOrders() {
  const [orders, setOrders] = useState(read);
  const update = list => {
    setOrders(list);
    localStorage.setItem(KEY, JSON.stringify(list));
  };

  useEffect(() => {
    const token = localStorage.getItem("booknest-token");
    if (!token) return;

    fetch(API, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => update(data.map(o => ({
        ...o, id: o._id,
        date: new Date(o.createdAt).toLocaleDateString(),
        items: o.items.map(i => ({
          id: i.book?._id, title: i.book?.title || "Book",
          price: i.book?.price || 0, quantity: i.quantity
        }))
      }))))
      .catch(console.error);
  }, []);

  async function cancel(order) {
    if (!window.confirm("Cancel this order?")) return;
    try {
      const token = localStorage.getItem("booknest-token");
      if (token && /^[a-f\d]{24}$/i.test(order.id)) {
        const r = await fetch(`${API}/${order.id}/cancel`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await r.json();
        if (!r.ok) throw Error(data.message || "Cancellation failed.");
      }
      update(orders.map(o => o.id === order.id
        ? { ...o, status: "Cancelled" } : o));
      alert("Order cancelled successfully!");
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <main className="page-container">
      <div className="page-heading">
        <span className="eyebrow">YOUR PURCHASES</span>
        <h1>My Orders</h1>
        <p>View the books you have ordered.</p>
      </div>

      {!orders.length ? (
        <div className="empty-state">
          <h2>No orders yet</h2>
          <p>Your placed orders will appear here.</p>
          <Link to="/books" className="btn">Explore Books</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(o => (
            <article className="order-card" key={o.id}>
              <div className="order-header">
                <div>
                  <h3>Order #{o.id}</h3>
                  <p>Placed on {o.date}</p>
                </div>
                <span className="order-status">{o.status || "Order Placed"}</span>
              </div>
              {o.items.map((i, n) => (
                <div className="order-item" key={`${i.id}-${n}`}>
                  <span>{i.title} × {i.quantity}</span>
                  <strong>₹{i.price * i.quantity}</strong>
                </div>
              ))}
              <div className="summary-total">
                <span>Order Total</span><strong>₹{o.total}</strong>
              </div>
              {o.status !== "Cancelled" && (
                <button className="btn" onClick={() => cancel(o)}>
                  Cancel Order
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
