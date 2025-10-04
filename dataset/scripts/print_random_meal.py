import json
import random
from pathlib import Path

RAW_DIR = Path(__file__).resolve().parents[1] / "raw"
DATA_FILE = RAW_DIR / "struggle_meals.json"

def print_random_meal():
    if not DATA_FILE.exists():
        print(f"No dataset found at {DATA_FILE}. Run the fetch script first.")
        return

    with open(DATA_FILE, "r") as f:
        recipes = json.load(f)

    if not recipes:
        print("No recipes found in struggle_meals.json.")
        return

    recipe = random.choice(recipes)

    print("\n🍳 Random Struggle Meal:")
    print(f"Title: {recipe.get('title')}")
    print(f"Ready in: {recipe.get('readyInMinutes', '?')} minutes")
    print(f"Servings: {recipe.get('servings', '?')}")
    print(f"Price per serving: ${recipe.get('pricePerServing', 0)/100:.2f}")
    print(f"Vegetarian: {recipe.get('vegetarian')}, Vegan: {recipe.get('vegan')}, Gluten Free: {recipe.get('glutenFree')}")
    print(f"Source: {recipe.get('sourceUrl')}")
    print("-" * 50)

    # Ingredients
    print("\n🛒 Ingredients:")
    for ing in recipe.get("extendedIngredients", []):
        amount = ing.get("amount")
        unit = ing.get("unit")
        name = ing.get("originalName") or ing.get("name")
        print(f"- {amount} {unit} {name}".strip())

    # Instructions
    print("\n👩‍🍳 Instructions:")
    instructions = recipe.get("analyzedInstructions", [])
    if instructions:
        steps = instructions[0].get("steps", [])
        for step in steps:
            print(f"{step['number']}. {step['step']}")
    else:
        # Fallback to plain text instructions
        summary = recipe.get("summary", "No instructions available.")
        print(summary)

if __name__ == "__main__":
    print_random_meal()
