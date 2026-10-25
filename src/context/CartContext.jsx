
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
const API = "http://localhost:5000/api/cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("booknest-cart") || "[]")
  );

  const token = localStorage.getItem("booknest-token");

  useEffect(() => {
    localStorage.setItem("booknest-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!token) return;

    fetch(API, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (data.items?.length) {
          setCart(data.items.map(i => ({
            ...i.book,
            id: i.book._id,
            genre: i.book.category || "Other",
            quantity: i.quantity
          })));
        }
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const items = cart.map(b => ({
      book: b._id || b.id,
      quantity: b.quantity
    }));

    fetch(API, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ items })
    }).catch(() => {});
  }, [cart, token]);

  function addToCart(book) {
    setCart(c => {
      const id = String(book.id || book._id);
      const found = c.find(b => String(b.id || b._id) === id);
      return found
        ? c.map(b => String(b.id || b._id) === id
          ? { ...b, quantity: b.quantity + 1 } : b)
        : [...c, { ...book, id, quantity: 1 }];
    });
  }

  function updateQuantity(id, amount) {
    setCart(c => c.map(b => String(b.id || b._id) === String(id)
      ? { ...b, quantity: b.quantity + amount } : b
    ).filter(b => b.quantity > 0));
  }

  function removeFromCart(id) {
    setCart(c => c.filter(b => String(b.id || b._id) !== String(id)));
  }

  return (
    <CartContext.Provider value={{
      cart, setCart, addToCart, updateQuantity, removeFromCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
