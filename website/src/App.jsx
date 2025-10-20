import { useState } from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";

function AppContent() {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setRecipes([]);

    try {
      const res = await fetch(
        `http://localhost:5050/api/recipe?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch recipes");
      setRecipes(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="title">Recipe Finder</h1>

      {/* Search bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search for a recipe..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Recipes grid */}
      <div className="recipes-grid">
        {recipes.map((r) => (
          <div key={r.id} className="recipe-card">
            <img src={r.image} alt={r.title} className="recipe-image" />
            <div className="recipe-info">
              <h3>{r.title}</h3>
              <p className="recipe-summary">{r.summary}</p>
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="recipe-link"
              >
                View full recipe →
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="auth-section">
        {user ? (
          <>
            <h3>Welcome, {user.email}</h3>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <h3>Sign up or Log in</h3>
            <Signup />
            <Login />
          </>
        )}
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
