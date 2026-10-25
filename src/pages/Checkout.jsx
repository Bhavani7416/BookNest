
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [form, setForm] = useState({
    name: "", email: "", address: "", city: "", pincode: ""
  });

  const total = cart.reduce((s, b) => s + b.price * b.quantity, 0);
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function placeOrder(e) {
    e.preventDefault();
    if (!cart.length) return;

    try {
      const token = localStorage.getItem("booknest-token");
      const items = cart.map(b => ({
        book: b._id || b.id, quantity: b.quantity
      }));

      if (token) {
        const res = await fetch("http://localhost:5000/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ items, paymentMethod })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Order failed.");
      }

      const order = {
        id: `BN${Date.now()}`,
        date: new Date().toLocaleDateString(),
        customer: form,
        items: cart,
        total,
        status: "Order Placed",
        paymentMethod,
        paymentStatus: paymentMethod === "Online" ? "Paid (Demo)" : "Pending"
      };

      const orders = JSON.parse(localStorage.getItem("booknest-orders") || "[]");
      localStorage.setItem("booknest-orders", JSON.stringify([order, ...orders]));
      setCart([]);
      alert(paymentMethod === "Online"
        ? "Demo Payment Successful! Order placed."
        : "Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      alert(err.message);
    }
  }

  if (!cart.length) return (
    <main className="page-container">
      <div className="empty-state">
        <h2>Your cart is empty</h2>
        <Link to="/books" className="btn">Explore Books</Link>
      </div>
    </main>
  );

  return (
    <main className="page-container">
      <div className="page-heading">
        <span className="eyebrow">ALMOST THERE</span>
        <h1>Checkout</h1>
        <p>Enter your delivery details to place your order.</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={placeOrder}>
          <h2>Delivery Details</h2>

          {[["name", "Full Name", "text"], ["email", "Email Address", "email"]].map(([name, label, type]) => (
            <div key={name}>
              <label>{label}</label>
              <input name={name} type={type} value={form[name]} onChange={change} required />
            </div>
          ))}

          <label>Delivery Address</label>
          <textarea name="address" value={form.address} onChange={change} required />

          <div className="checkout-fields">
            {["city", "pincode"].map(name => (
              <div key={name}>
                <label>{name === "city" ? "City" : "PIN Code"}</label>
                <input name={name} value={form[name]} onChange={change}
                  inputMode={name === "pincode" ? "numeric" : undefined}
                  pattern={name === "pincode" ? "[0-9]{6}" : undefined}
                  maxLength={name === "pincode" ? 6 : undefined} required />
              </div>
            ))}
          </div>

          <label>Payment Method</label>
          <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option value="COD">Cash on Delivery</option>
            <option value="Online">Online Payment</option>
          </select>

          <p className="payment-note">
            {paymentMethod === "COD"
              ? "Pay when your order is delivered."
              : "Demo payment only. No real money will be collected."}
          </p>

          <button className="btn checkout-submit" type="submit">
            {paymentMethod === "Online" ? "Pay Now" : "Place Order"} · ₹{total}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>
          {cart.map((b, i) => (
            <div className="checkout-item" key={`${b.id || b._id}-${i}`}>
              <span>{b.title} × {b.quantity}</span>
              <strong>₹{b.price * b.quantity}</strong>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span><strong>₹{total}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}
