import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Community() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const snapshot = await getDocs(collection(db, "recipes"));
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(list);
      } catch (err) {
        console.error("Error loading Firestore recipes:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  if (loading) return <p>Loading recipes...</p>;

  return (
    <div>
      <h1>Community Recipes</h1>
      <div className="recipes-grid">
        {recipes.map((r) => (
          <div key={r.id} className="recipe-card">
            <img src={r.image} alt={r.title} className="recipe-image" />
            <div className="recipe-info">
              <h3>{r.title}</h3>
              <p>{r.summary}</p>
              {r.url && (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="recipe-link"
                >
                  View full recipe →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}