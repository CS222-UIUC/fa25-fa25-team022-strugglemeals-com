import { useState } from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import ChatButton from "./components/ChatButton.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import NavBar from "./components/Navbar.jsx"
//import Community from "./components/community.js"
import UploadRecipe from "./components/UploadRecipe.jsx";
import UserProfile from "./components/UserProfile.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import "./App.css";

//have a designated homepage to start and then we can go to the other pages from there

function HomePage() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatRecipe, setChatRecipe] = useState(null);

  const handleChatbotButton = (recipeObj) => {
    setChatOpen(false);
    setChatRecipe(null);

    setTimeout(() => {
      setChatRecipe(recipeObj);
      setChatOpen(true);
    }, 0);
  };

  const handleSearch = async () => {
  if (!searchQuery.trim()) return;

  setLoading(true);
  setError("");   // clear previous errors
  setRecipes([]);

  try {
    let spoonacularData = [];

    //have a try in case our spoonacular api expires or something
    try {
      const res = await fetch(
        `http://localhost:5050/api/recipe?q=${encodeURIComponent(searchQuery)}`
      );

      if (res.ok) {
        const data = await res.json();
        spoonacularData = data.map(r => ({ ...r, source: "Spoonacular" }));
      }
    } catch (err) {
      console.warn("Spoonacular fetch failed:", err.message);
    }

    //want search to be case insensitive
    const querySnapshot = await getDocs(collection(db, "recipes"));
    const firestoreData = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data(), source: "Firestore" }))
      .filter(r =>
        r.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // --- Combine results ---
    const combinedResults = [...spoonacularData, ...firestoreData];
    setRecipes(combinedResults);

    if (combinedResults.length === 0) {
      setError("No recipes found for that search.");
    }

  } catch (err) {
    console.error("Search error:", err);
    setError("Failed to fetch recipes.");
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
                onClickHandler={() => handleChatbotButton(r)}
              />
              <h3>{r.title}</h3>
              <p className="recipe-summary">{r.summary}</p>
              <a href={r.url} target="_blank" rel="noreferrer" className="recipe-link">
                View full recipe →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <ChatWindow
        open={chatOpen}
        recipe={chatRecipe}
        onClose={() => setChatOpen(false)}
      />

      {/* Auth section */}
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

// function AppContent() {
//   const { user, logout } = useAuth();
//   const [query, setQuery] = useState("");
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Chat state
//   const [chatOpen, setChatOpen] = useState(false);
//   const [chatRecipe, setChatRecipe] = useState(null);

//   // When user clicks "ChefBot" button
//   function handleChatbotButton(recipeObj) {
//     // Force ChatWindow to fully reset by unmounting it
//     setChatOpen(false);
//     setChatRecipe(null);

//     // Re-open with new recipe
//     setTimeout(() => {
//       setChatRecipe(recipeObj);
//       setChatOpen(true);
//     }, 0);
//   }


//   // Search recipes
//   const handleSearch = async () => {
//     if (!query.trim()) return;
//     setLoading(true);
//     setError("");
//     setRecipes([]);

//     try {
//       const res = await fetch(
//         `http://localhost:5050/api/recipe?q=${encodeURIComponent(query)}`
//       );
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to fetch recipes");
//       setRecipes(data);
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <h1 className="title">Recipe Finder</h1>

//       {/* Search bar */}
//       <div className="search-container">
//         <input
//           type="text"
//           className="search-bar"
//           placeholder="Search for a recipe..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <button onClick={handleSearch} className="search-button">
//           Search
//         </button>
//       </div>

//       {loading && <p>Loading...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {/* Recipes grid */}
//       <div className="recipes-grid">
//         {recipes.map((r) => (
//           <div key={r.id} className="recipe-card">
//             <img src={r.image} alt={r.title} className="recipe-image" />

//             <div className="recipe-info">
//               <ChatButton
//                 type="button"
//                 className="chatbot-button"
//                 onClickHandler={() => handleChatbotButton(r)}   // full recipe object
//               />
//               <h3>{r.title}</h3>
//               <p className="recipe-summary">{r.summary}</p>
//               <a
//                 href={r.url}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="recipe-link"
//               >
//                 View full recipe →
//               </a>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Chat Window — floating on top */}
//       <ChatWindow
//         open={chatOpen}
//         recipe={chatRecipe}            // FIXED: send full recipe, not recipeTitle
//         onClose={() => setChatOpen(false)}
//       />

//       {/* Authentication section */}
//       <div className="auth-section">
//         {user ? (
//           <>
//             <h3>Welcome, {user.email}</h3>
//             <button onClick={logout} className="logout-btn">
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <h3>Sign up or Log in</h3>
//             <Signup />
//             <Login />
//             <ResetPassword />
//           </>
//         )}
//       </div>
//     </>
//   );
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// }
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/upload" element={<UploadRecipe />} />
          {/* <Route path="/" element={<AppContent />} />
          {<Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/community" element={<Community />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutUs />} /> } 
           */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// function AppRouter() {
//   return (
//     <Router>
//       <div style={{
//         fontFamily: 'Arial',
//         backgroundColor: '#ffffffff',
//         backgroundRepeat: 'repeat',
//         backgroundSize: 'auto',
//         minHeight: '100vh',
//       }}>
//         {/* Updated to use Navbar */}
//         <NavBar />

//         <ScrollToTop />
//         <Routes>
          
//         </Routes>
//       </div>
//     </Router>
//   );
//   }

