import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

/** Return the last assistant reply, ignoring system/user messages */
function getLastAssistantReply(history) {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === "assistant") return history[i].content;
  }
  return "Let's get back to cooking!";
}

class ChatbotClient {
  constructor({
    model = "meta-llama/Meta-Llama-3-8B-Instruct",
    token = process.env.HUGGING_FACE_API_KEY,
  } = {}) {
    if (!token) throw new Error("Missing HUGGING_FACE_API_KEY in .env");

    this.model = model;
    this.client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: token,
    });

    this.history = [];
    this.injectedRecipe = false;
    this.currentRecipeTitle = null;
  }

  /** Reset conversation when a new recipe is selected */
  reset() {
    this.history = [];
    this.injectedRecipe = false;
    this.currentRecipeTitle = null;
  }

  /** Off-topic classifier */
  async classifyOffTopic(userMessage) {
    const lastReply = getLastAssistantReply(this.history);

    const checkPrompt = `
You are ChefBot, a cooking assistant.

Your job is to decide whether the user's reply is relevant to the cooking conversation.

A reply is RELEVANT ("yes") if it does ANY of the following:
- Answers ChefBot’s question, even vaguely
- Says they don't care ("any type", "doesn't matter", "whatever works")
- Shows acknowledgment ("ok", "sure", "yes", "sounds good")
- Asks to start over ("can we start over")
- Continues the cooking conversation in any way

A reply is OFF TOPIC ("no") only if:
- The user changes to a completely unrelated topic

Your entire output must be EXACTLY one word: "yes" or "no"

ChefBot said: "${lastReply}"
User replied: "${userMessage}"
`;

    const classification = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: "user", content: checkPrompt }],
      max_tokens: 2,
      temperature: 0,
    });

    const answer = classification.choices[0].message.content.trim().toLowerCase();
    return answer.includes("no"); // true if off topic
  }

  /** Main response handler */
  async getResponse(userMessage, recipe = null) {
    // NEW RECIPE? Reset state.
    if (recipe && this.currentRecipeTitle !== recipe.title) {
      this.reset();
      this.currentRecipeTitle = recipe.title;
    }

    // Inject system prompt ONCE per recipe
    if (recipe && !this.injectedRecipe) {
      this.history.push({
        role: "system",
        content: `
You are ChefBot, a concise and friendly cooking assistant.
Use the user's selected recipe to guide the cooking process conversationally.

Here is the recipe context that you will need to know for this conversation.
Title: ${recipe.title}

Ingredients:
${recipe.ingredients}

Instructions:
${recipe.instructions}

RULES:
- Do NOT recite the full recipe unless asked.
- Keep responses under 2 sentences.
- Reveal cooking steps gradually.
        `.trim(),
      });

      this.injectedRecipe = true;
    }

    // Off-topic check
    if (recipe) {
      const offTopic = await this.classifyOffTopic(userMessage);
      if (offTopic) {
        const lastReply = getLastAssistantReply(this.history);
        return `Let's not go off topic! ${lastReply}`;
      }
    }

    // Add user message
    this.history.push({ role: "user", content: userMessage });

    // Call the LLM
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: this.history,
      temperature: 0.6,
    });

    const reply = completion.choices[0].message.content.trim();

    // Store assistant reply
    this.history.push({ role: "assistant", content: reply });

    return reply;
  }
}

export default ChatbotClient;
