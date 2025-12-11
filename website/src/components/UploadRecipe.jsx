import { useState } from "react";
import { useAuth } from "../AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./UploadRecipe.css";


export default function UploadRecipe() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to upload a recipe");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "recipes"), {
        title,
        summary,
        image,
        userID: user.uid,
        date: serverTimestamp(),
      });
      alert("Recipe uploaded!");
      navigate("/profile");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload a New Recipe</h2>

      <form className="upload-form" onSubmit={handleSubmit}>
        <label className="upload-label">Recipe Title</label>
        <input
          className="upload-input"
          type="text"
          placeholder="e.g., Creamy Garlic Pasta"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="upload-label">Summary</label>
        <textarea
          className="upload-textarea"
          placeholder="Write a short description..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        />

        <label className="upload-label">Image URL</label>
        <input
          className="upload-input"
          type="text"
          placeholder="https://example.com/photo.jpg"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />

        <button className="upload-button" type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Recipe"}
        </button>
      </form>
    </div>
  );
}
