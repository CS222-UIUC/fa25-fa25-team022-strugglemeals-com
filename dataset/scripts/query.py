import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

API_KEY = os.getenv("SPOONACULAR_API_KEY")
BASE_URL = "https://api.spoonacular.com/recipes/complexSearch"

def main():
    if not API_KEY:
        print("Error: SPOONACULAR_API_KEY not found in environment.")
        return

    query = input("Enter a recipe to search for: ").strip()
    if not query:
        print("Please enter a valid query.")
        return

    params = {
        "query": query,
        "number": 1,
        "apiKey": API_KEY
    }

    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()

        results = data.get("results", [])
        if not results:
            print("No recipes found.")
            return

        recipe = results[0]
        title = recipe.get("title", "Unknown title")
        image = recipe.get("image", "No image available")
        recipe_id = recipe.get("id")

        print("\n--- Recipe Found ---")
        print(f"Title: {title}")
        print(f"ID: {recipe_id}")
        print(f"Image: {image}")
        print(f"More Info: https://spoonacular.com/recipes/{'-'.join(title.lower().split())}-{recipe_id}")
        print("-------------------\n")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching recipe: {e}")

if __name__ == "__main__":
    main()
