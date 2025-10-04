import os
import json
import random
from pathlib import Path
from dotenv import load_dotenv
from flask import Flask, jsonify, request
# TEST IT OUT AT http://127.0.0.1:5001/api/recipe/random
app = Flask(__name__)

# Load recipes from JSON dataset
DATA_FILE = Path(__file__).resolve().parents[1] / "raw" / "struggle_meals.json"
if not DATA_FILE.exists():
    raise FileNotFoundError(f" Could not find dataset at {DATA_FILE}. Run fetch first!")

with open(DATA_FILE, "r") as f:
    RECIPES = json.load(f)

# Utility: pick a random recipe and normalize it
def normalize_recipe(recipe):
    instructions = []

    # First try structured instructions
    for inst in recipe.get("analyzedInstructions", []):
        for step in inst.get("steps", []):
            instructions.append(step.get("step"))

    # If empty, fall back to plain text field
    if not instructions and recipe.get("instructions"):
        instructions = [recipe.get("instructions")]

    # If still empty, fallback to summary text
    if not instructions and recipe.get("summary"):
        instructions = [recipe.get("summary")]

    return {
        "id": recipe.get("id"),
        "title": recipe.get("title"),
        "readyInMinutes": recipe.get("readyInMinutes"),
        "servings": recipe.get("servings"),
        "pricePerServing": recipe.get("pricePerServing"),
        "image": recipe.get("image"),
        "ingredients": [
            ing.get("original") for ing in recipe.get("extendedIngredients", [])
        ],
        "instructions": instructions,
        "sourceUrl": recipe.get("sourceUrl"),
    }


@app.route("/api/recipe/random", methods=["GET"])
def random_recipe():
    """Return a random recipe."""
    if not RECIPES:
        return jsonify({"error": "No recipes available"}), 404
    recipe = random.choice(RECIPES)
    return jsonify(normalize_recipe(recipe))

@app.route("/api/recipe/search", methods=["GET"])
def search_recipe():
    """Stub search endpoint: returns a random recipe for now."""
    query = request.args.get("query", "")
    if not RECIPES:
        return jsonify({"error": "No recipes available"}), 404

    # TODO: implement real search later (vector/filters)
    recipe = random.choice(RECIPES)
    return jsonify({
        "query": query,
        "result": normalize_recipe(recipe)
    })

if __name__ == "__main__":
    app.run(debug=True, port=5001)
