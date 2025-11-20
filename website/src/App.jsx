import { useState } from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import ChatButton from "./components/ChatButton.jsx";
import ChatWindow from "./components/ChatWindow.jsx";

function ResetPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setMessage("Password reset email sent! Check your inbox.");
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div className="reset-password">
      <h3>Forgot your password?</h3>
      <form onSubmit={handleReset} className="reset-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

function AppContent() {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatRecipe, setChatRecipe] = useState(null);

  // When user clicks "ChefBot" button
  function handleChatbotButton(recipeObj) {
    // Force ChatWindow to fully reset by unmounting it
    setChatOpen(false);
    setChatRecipe(null);

    // Re-open with new recipe
    setTimeout(() => {
      setChatRecipe(recipeObj);
      setChatOpen(true);
    }, 0);
  }


  // Search recipes
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
              <ChatButton
                type="button"
                className="chatbot-button"
                onClickHandler={() => handleChatbotButton(r)}   // full recipe object
              />
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

      {/* Chat Window — floating on top */}
      <ChatWindow
        open={chatOpen}
        recipe={chatRecipe}            // FIXED: send full recipe, not recipeTitle
        onClose={() => setChatOpen(false)}
      />

      {/* Authentication section */}
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
            <ResetPassword />
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
