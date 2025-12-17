# StruggleMeals.com

**CS 222 – Group 22**

StruggleMeals.com is a web application that helps college students and beginner cooks make **simple, affordable meals** using ingredients they already have at home. The platform combines ingredient-based search, budget and dietary filters, and an optional AI-powered cooking assistant to reduce the intimidation around cooking.

## Project Summary
College students often struggle to cook due to limited time, money, and experience. Many rely on repetitive or unhealthy food options because cooking feels overwhelming or inaccessible.

**StruggleMeals.com** addresses this problem by providing:
* Ingredient-based recipe search
* An optional AI chatbot that guides users step-by-step through recipes

Our goal is to make cooking **realistic, approachable, and affordable** for everyone.

# System Architecture Diagram

```text
[ React + TypeScript Frontend ]
            |
            |  /api/chat   /api/recipe
            v
[ Node.js Backend API Server ]
     |                |
     |                |
     v                v
[ Spoonacular API ]   [ Llama-3-8b (Hugging Face) ]
     |
     v
[ Firebase Auth ]
```
- The frontend handles user interaction and displays results.
- The backend coordinates API calls and enforces authentication.
- Spoonacular provides structured recipe data.
- Llama-3-8b powers the AI cooking assistant.
- Firebase manages authentication and user data.

## Installation & Reproducibility

### Prerequisites

* Node.js (v18+)
* Python 3.9+
* Git
* HuggingFace API Key
* Spoonacular API Key

### 1️. Clone the Repository

```bash
git clone [https://github.com/your-org/strugglemeals.git](https://github.com/CS222-UIUC/fa25-fa25-team022-strugglemeals-com.git)
cd strugglemeals
```

### 2️. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

### 3️. Backend Setup

Create a `.env` file:

```env
HUGGINGFACE_API_KEY=your_api_key
SPOONACULAR_API_KEY=your_api_key
```

Run the backend:

```bash
cd website
cd backend
node server.js
```

Backend runs at:

```
http://localhost:5000
```

## Team Members & Roles

**CS 222 – Group 22**

| Name          | NetID    | Role                                |
| ------------- | -------- | ----------------------------------- |
| Jaibilin Jain | jjain    | Backend Development, Firebase       |
| Pari Kulkarni | pari5    | Frontend Development, UI/UX Design  |
| Katie Li      | katieli3 | Backend Development, API & Database |
| Pia Robinson  | piarr2   | Frontend Development, Design        |

### Team Workflow
* Frontend and backend developed in parallel
* GitHub branching and pull request reviews
* Weekly check-ins and collaborative debugging
* Shared responsibility for testing and documentation
  
## What Makes StruggleMeals Unique
* **AI Cooking Assistant** for step-by-step guidance
* **Community & Cultural Recipe Submissions**

**Happy Cooking! 🍜**
