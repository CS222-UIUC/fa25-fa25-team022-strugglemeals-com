import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function UserProfile() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRecipes = async () => {
      try {
        const q = query(
          collection(db, "recipes"),
          where("userID", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const userRecipes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(userRecipes);
      } catch (err) {
        console.error("Failed to load recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user]);

  if (loading) return <p>Loading your recipes...</p>;

  return (
    <div style={{ paddingTop: "100px" }}>
      <h2>{user?.email}'s Recipes</h2>
      {recipes.length === 0 && <p>You haven’t uploaded any recipes yet.</p>}
      <div className="recipes-grid">
        {recipes.map(r => (
          <div key={r.id} className="recipe-card">
            <img src={r.image} alt={r.title} className="recipe-image" />
            <div className="recipe-info">
              <h3>{r.title}</h3>
              <p>{r.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}