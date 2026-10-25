
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("booknest-token", data.token);
      localStorage.setItem("booknest-user", JSON.stringify(data.user));
      alert("Login successful!");
      navigate("/");
    } catch (err) {
      alert(err.message || "Cannot connect to server.");
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-icon"><BookOpen size={28} /></div>
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Sign in to BookNest</h1>
        <p>Continue your reading journey.</p>
        <label>Email address</label>
        <input type="email" placeholder="you@example.com" value={email}
          onChange={e => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" placeholder="Enter your password" value={password}
          onChange={e => setPassword(e.target.value)} required />
        <button className="btn auth-submit">Sign In</button>
        <p className="auth-switch">Don't have an account? <Link to="/signup">Create one</Link></p>
      </form>
    </main>
  );
}
