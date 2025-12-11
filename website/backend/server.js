import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import ChatbotClient from "./chatbot.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = "https://api.spoonacular.com/recipes/complexSearch";

// Instantiate ChefBot
const bot = new ChatbotClient();

// -----------------------------------------------------
// Health-check
// -----------------------------------------------------
app.get("/", (req, res) =>
  res.send("Backend running with Spoonacular + ChefBot!")
);

// -----------------------------------------------------
// Recipe Search Endpoint
// -----------------------------------------------------
app.get("/api/recipe", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter ?q=" });
  }

  try {
    // 1. perform complex search
    const searchRes = await axios.get(BASE_URL, {
      params: { query, number: 3, apiKey: API_KEY },
    });

    const results = searchRes.data.results;

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "No recipes found" });
    }

    // 2. fetch full information for each recipe
    const fullRecipes = await Promise.all(
      results.map(async (r) => {
        const infoURL = `https://api.spoonacular.com/recipes/${r.id}/information`;

        const fullRes = await axios.get(infoURL, {
          params: { apiKey: API_KEY },
        });

        const full = fullRes.data;

        return {
          id: r.id,
          title: r.title,
          image: r.image,
          url: full.sourceUrl || null,
          summary: full.summary
            ? full.summary.replace(/<[^>]+>/g, "").slice(0, 160) + "..."
            : "No summary.",
          ingredients: full.extendedIngredients
            ? full.extendedIngredients
                .map((i) => `• ${i.original}`)
                .join("\n")
            : "No ingredient list found.",
          instructions: full.instructions
            ? full.instructions.replace(/<[^>]+>/g, "")
            : "No instructions provided.",
        };
      })
    );

    return res.json(fullRecipes);
  } catch (err) {
    console.error("Error from Spoonacular:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Failed to fetch recipes",
      details: err.message,
    });
  }
});

// -----------------------------------------------------
// Chat Endpoint — sends user message + recipe to ChefBot
// -----------------------------------------------------
app.post("/api/chat", async (req, res) => {
  const { message, recipe } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Reset conversation when a new recipe is selected
    if (recipe) {
      bot.reset();
    }

    const reply = await bot.getResponse(message, recipe);
    return res.json({ reply });

  } catch (err) {
    console.error("Chatbot error:", err);
    return res.status(500).json({
      error: "Chatbot error",
      details: err.message,
    });
  }
});


// -----------------------------------------------------
// Start server
// -----------------------------------------------------
const PORT = process.env.PORT || 5050;
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
