import { useState } from "react";
import { useAuth } from "../AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

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
      navigate("/profile"); // go back to profile after upload
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: "100px" }}>
      <h2>Upload Recipe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Recipe"}
        </button>
      </form>
    </div>
  );
}