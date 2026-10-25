
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { useState } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      localStorage.setItem("booknest-token", data.token);
      localStorage.setItem("booknest-user", JSON.stringify(data.user));
      alert("Account created successfully!");
      navigate("/");
    } catch (err) {
      alert(err.message || "Cannot connect to server.");
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-icon"><BookOpen size={28} /></div>
        <span className="eyebrow">JOIN OUR COMMUNITY</span>
        <h1>Create your account</h1>
        <p>Your next favourite book is waiting.</p>
        <label>Full name</label>
        <input value={name} onChange={e => setName(e.target.value)}
          placeholder="Your name" required />
        <label>Email address</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com" required />
        <label>Password</label>
        <input type="password" value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="At least 6 characters" minLength={6} required />
        <button className="btn auth-submit">Create Account</button>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </form>
    </main>
  );
}
