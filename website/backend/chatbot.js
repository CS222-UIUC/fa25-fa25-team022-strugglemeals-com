import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

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
  }

  // is this question off topic?
 async classifyOffTopic(userMessage) {
    const lastReply =
      this.history.length > 0
        ? this.history[this.history.length - 1].content
        : "(none yet)";

    const checkPrompt = `
You are ChefBot, a cooking assistant.

Your job is to decide whether the user's reply is relevant to the cooking conversation.

A reply is RELEVANT ("yes") if it does ANY of the following:
- Answers ChefBot’s question, even vaguely
- Says they don't care ("any type", "doesn't matter", "whatever works") or gives a general preference
- Shows acknowledgment ("ok", "sure", "yes", "sounds good")
- Asks to start the process over ("can we start over")
- Continues the cooking conversation in any way

A reply is OFF TOPIC ("no") only if:
- The user changes to a completely unrelated topic (school, sports, drama, random facts, etc.)

IMPORTANT:
Do NOT treat vague or non-specific answers as off topic.
Do NOT require the user to give a specific cooking detail.

Your entire output must be EXACTLY one word:
"yes" or "no"

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

  //main chat logic
  async getResponse(userMessage, recipeTitle = null) {
    //CHECK IF OFF TOPIC
    if (recipeTitle) {
      const offTopic = await this.classifyOffTopic(userMessage, recipeTitle);
      if (offTopic) {
        const lastReply =
          this.history.length > 0
            ? this.history[this.history.length - 1].content
            : "Let's get back to cooking!";
        return `Let's not go off topic! ${lastReply}`;
      }
    }

    //otherwise, normal response flow
    this.history.push({ role: "user", content: userMessage });

    const chatCompletion = await this.client.chat.completions.create({
      model: this.model,
      messages: this.history,
      //max_tokens: 80, //MAX TOKENS - MAY BE ABLE TO CHANGE
      temperature: 0.6,
    });

    const reply = chatCompletion.choices[0].message.content.trim();
    this.history.push({ role: "assistant", content: reply });
    return reply;
  }
}

export default ChatbotClient;
