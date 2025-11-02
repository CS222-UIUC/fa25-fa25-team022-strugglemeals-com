import readline from "readline";
import ChatbotClient from "./chatbot.js";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const SPOON_KEY = process.env.SPOONACULAR_API_KEY;
const bot = new ChatbotClient();

async function getRandomRecipe() {
  const url = `https://api.spoonacular.com/recipes/random?apiKey=${SPOON_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.recipes || data.recipes.length === 0) throw new Error("No recipe found!");
  const recipe = data.recipes[0];

  return {
    title: recipe.title,
    ingredients: recipe.extendedIngredients
      ? recipe.extendedIngredients.map((i) => `• ${i.original}`).join("\n")
      : "No ingredient list found.",
    instructions:
      recipe.instructions?.replace(/<\/?[^>]+(>|$)/g, "") || "No instructions provided.",
  };
}

async function start() {
  console.log("👩Fetching a random recipe from Spoonacular...");
  const recipe = await getRandomRecipe();

  console.log(`\nToday's recipe: ${recipe.title}\n`);
  console.log("Ingredients:\n" + recipe.ingredients + "\n");


  const introPrompt = `
You are ChefBot, a concise and friendly cooking assistant.
Your job is to guide the user through the recipe conversationally, one step at a time.

--- RECIPE CONTEXT (for your reference only) ---
Title: ${recipe.title}
Ingredients: ${recipe.ingredients}
Instructions: ${recipe.instructions}
-------------------------------------------------

Rules for your replies:
- Do NOT repeat or summarize the entire recipe unless asked.
- Keep responses under 2 sentences.
- Only reveal one step or action at a time.
- Wait for the user's input before continuing.
- Start the conversation by saying exactly:
"Ready to make ${recipe.title}? Let’s get started!"
and then wait for the user to respond. You MUST keep responses under 2 sentences.
`;


  const intro = await bot.getResponse(introPrompt);
  console.log("ChefBot:", intro.trim());


  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  function ask() {
    rl.question("You: ", async (msg) => {
      if (msg.toLowerCase() === "quit") {
        console.log("Goodbye!");
        rl.close();
        return;
      }
      const reply = await bot.getResponse(msg, recipe.title);
      console.log("ChefBot:", reply.trim());
      ask();
    });
  }

  ask();
}

start().catch((err) => console.error("Error:", err));
