
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRound, BookOpen, ShoppingBag, Heart, CheckCircle, LogOut } from "lucide-react";

const API = "http://localhost:5000/api/auth/profile";
const read = key => JSON.parse(localStorage.getItem(key) || "[]");

export default function Profile() {
  const [name, setName] = useState("Book Lover");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("booknest-token");

  useEffect(() => {
    if (!token) return;
    fetch(API, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(u => { setName(u.name); setEmail(u.email); })
      .catch(() => setMessage("Could not load profile."));
  }, [token]);

  async function saveProfile(e) {
    e.preventDefault();
    try {
      if (token) {
        const r = await fetch(API, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ name, email })
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data.message);
        setName(data.name);
        setEmail(data.email);
      }
      localStorage.setItem("booknest-user-name", name);
      localStorage.setItem("booknest-user-email", email);
      localStorage.setItem("booknest-user", JSON.stringify({ name, email }));
      setMessage("Profile saved successfully!");
    } catch (err) {
      setMessage(err.message || "Could not save profile.");
    }
  }

  function logout() {
    ["booknest-token", "booknest-user", "booknest-user-name",
      "booknest-user-email"].forEach(key => localStorage.removeItem(key));
    navigate("/login");
  }

  const shelf = read("booknest-reading-shelf");
  const books = Array.isArray(shelf) ? shelf : Object.values(shelf);
  const stats = [
    ["Orders", read("booknest-orders").length, ShoppingBag],
    ["My Books", books.length, BookOpen],
    ["Completed", books.filter(b => b.status === "Completed").length, CheckCircle],
    ["Wishlist", read("booknest-wishlist").length, Heart]
  ];

  return (
    <main className="profile-page">
      <div className="profile-heading">
        <span className="profile-icon"><UserRound size={30} /></span>
        <div><h1>My Profile</h1><p>Manage your account and reading journey.</p></div>
      </div>

      <section className="profile-stats">
        {stats.map(([label, value, Icon]) => (
          <article className="profile-stat" key={label}>
            <Icon size={23} /><h2>{value}</h2><p>{label}</p>
          </article>
        ))}
      </section>

      <form className="profile-form" onSubmit={saveProfile}>
        <h2>Personal Information</h2>
        <label htmlFor="profile-name">Full Name</label>
        <input id="profile-name" value={name}
          onChange={e => setName(e.target.value)} required />

        <label htmlFor="profile-email">Email Address</label>
        <input id="profile-email" type="email" value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email" required />

        <button type="submit">Save Profile</button>
        {message && <p className="profile-message">{message}</p>}
      </form>

      <Link className="profile-shelf-link" to="/reading-shelf">
        View My Reading Shelf →
      </Link>

      <button className="profile-logout" onClick={logout}>
        <LogOut size={18} /> Logout
      </button>
    </main>
  );
}
