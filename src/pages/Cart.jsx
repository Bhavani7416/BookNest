
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  if (!cart.length) {
    return (
      <main className="container catalog empty-state">
        <ShoppingBag size={42} />
        <h1>Your cart is empty</h1>
        <p>Find a book for your next reading adventure.</p>
        <Link to="/books" className="btn">Explore Books</Link>
      </main>
    );
  }

  return (
    <main className="container catalog">
      <span className="eyebrow">YOUR COLLECTION</span>
      <h1>Shopping Cart</h1>

      <div className="cart-layout">
        <div className="cart-list">
          {cart.map(item => (
            <article className="cart-item" key={item.id}>
              <img src={item.image} alt={item.title} />
              <div className="cart-item-info">
                <h3>{item.title}</h3>
                <p>{item.author}</p>
                <strong>₹{item.price}</strong>
                <div className="quantity">
                  <button onClick={() => updateQuantity(item.id, -1)}>
                    <Minus size={15} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>
                    <Plus size={15} />
                  </button>
                </div>
              </div>
              <button
                className="remove-btn"
                aria-label={`Remove ${item.title}`}
                onClick={() => removeFromCart(item.id)}
              >
                <Trash2 size={18} />
              </button>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>
          <p><span>Items ({cart.length})</span><strong>₹{total}</strong></p>
          <p><span>Delivery</span><strong>Free</strong></p>
          <div className="summary-total">
            <span>Total</span><strong>₹{total}</strong>
          </div>
          <Link to="/checkout" className="btn checkout-btn">
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}
