import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

class ChatbotClient {
  constructor({
    model = "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai",
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
You are ChefBot, a helpful cooking assistant.
Compare the following two messages:

ChefBot said: "${lastReply}"
User replied: "${userMessage}"

Determine if the user's message is directly relevant to what ChefBot just said or to continuing the cooking process.
If it is relevant, respond ONLY with "yes".
If it is off topic, respond ONLY with "no".
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
