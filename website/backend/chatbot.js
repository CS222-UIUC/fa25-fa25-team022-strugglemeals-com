import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config();

/** Return the last assistant reply */
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

    this.client = new HfInference(token);

    this.history = [];
    this.injectedRecipe = false;
    this.currentRecipeTitle = null;
  }

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

    const resp = await this.client.chatCompletion({
      model: this.model,
      messages: [{ role: "user", content: checkPrompt }],
      max_tokens: 5,
      temperature: 0,
    });

    const answer = resp.choices[0].message.content.trim().toLowerCase();
    return answer.includes("no");
  }

  /** Main response handler */
  async getResponse(userMessage, recipe = null) {
    if (recipe && this.currentRecipeTitle !== recipe.title) {
      this.reset();
      this.currentRecipeTitle = recipe.title;
    }

    if (recipe && !this.injectedRecipe) {
      this.history.push({
        role: "system",
        content: `
You are ChefBot, a concise and friendly cooking assistant.

Here is the recipe context.
Title: ${recipe.title}

Ingredients:
${recipe.ingredients}

Instructions:
${recipe.instructions}

RULES:
- Do NOT recite the full recipe unless asked.
- Keep responses under 2 sentences.
- Reveal steps gradually.
        `.trim(),
      });

      this.injectedRecipe = true;
    }

    if (recipe) {
      const offTopic = await this.classifyOffTopic(userMessage);
      if (offTopic) {
        const lastReply = getLastAssistantReply(this.history);
        return `Let's not go off topic! ${lastReply}`;
      }
    }

    this.history.push({ role: "user", content: userMessage });

    const completion = await this.client.chatCompletion({
      model: this.model,
      messages: this.history,
      temperature: 0.6,
    });

    const reply = completion.choices[0].message.content.trim();

    this.history.push({ role: "assistant", content: reply });

    return reply;
  }
}

export default ChatbotClient;
