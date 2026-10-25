
import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();
const API = "http://localhost:5000/api/wishlist";

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() =>
    JSON.parse(localStorage.getItem("booknest-wishlist") || "[]")
  );

  const token = localStorage.getItem("booknest-token");

  useEffect(() => {
    localStorage.setItem("booknest-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (!token) return;

    fetch(API, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setWishlist(data.books || []))
      .catch(() => {});
  }, [token]);

  async function toggleWishlist(book) {
    const id = book._id || book.id;
    const exists = wishlist.some(b => (b._id || b.id) === id);

    setWishlist(current =>
      exists
        ? current.filter(b => (b._id || b.id) !== id)
        : [...current, book]
    );

    if (!token || !/^[a-f\d]{24}$/i.test(id || "")) return;

    try {
      await fetch(`${API}/${id}`, {
        method: exists ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Wishlist sync failed:", error);
    }
  }

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
