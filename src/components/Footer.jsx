import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <Link to="/" className="logo">
        <BookOpen /> BookNest
      </Link>
      <p>Discover stories. Collect ideas. Find your next chapter.</p>
      <span>© 2026 BookNest. Built for book lovers.</span>
    </footer>
  );
}