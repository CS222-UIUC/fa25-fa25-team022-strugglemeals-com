import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = "https://api.spoonacular.com/recipes/complexSearch";

// health-check
app.get("/", (req, res) => res.send("Backend running with Spoonacular!"));

app.get("/api/recipe", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Missing query parameter ?q=" });
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: { query, number: 3, apiKey: API_KEY },
    });

    const results = response.data.results;
    if (!results || results.length === 0) {
      return res.status(404).json({ error: "No recipes found" });
    }

    const formatted = results.map((r) => ({
      id: r.id,
      title: r.title,
      image: r.image,
      summary: r.summary
        ? r.summary.replace(/<[^>]+>/g, "").slice(0, 120) + "..."
        : "A delicious recipe you’ll love.",
      url: `https://spoonacular.com/recipes/${r.title
        .toLowerCase()
        .replace(/\s+/g, "-")}-${r.id}`,
    }));

    return res.json(formatted); // <== return here
  } catch (err) {
    console.error("Error from Spoonacular:", err.response?.data || err.message);
    return res
      .status(500)
      .json({ error: "Failed to fetch from Spoonacular", details: err.message });
  }
});


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
