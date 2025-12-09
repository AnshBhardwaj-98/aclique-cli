import { google } from "@ai-sdk/google";
import { config } from "../../config/google.config.js";
import chalk from "chalk";
import { convertToModelMessages, streamText } from "ai";

export class aiService {
  constructor() {
    if (!config.googleApiKey) {
      throw new Error("Google API not found");
    }

    this.model = google(config.acliqueModel, {
      apiKey: config.googleApiKey,
    });
  }

  // ai service function:

  async sendMessages(messages, onChunk, tools = undefined, onToolCall = null) {
    try {
      const streamConfig = {
        model: this.model,
        messages: messages,
      };

      const result = streamText(streamConfig);

      let fullResponse = "";
      for await (const delta of result.textStream) {
        fullResponse += delta;
        if (onChunk) {
          onChunk(delta);
        }
      }

      const fullResult = result;

      return {
        content: fullResponse,
        finishedResponse: fullResult.finishReason,
        usage: fullResult.usage,
      };
    } catch (error) {
      console.log(
        chalk.redBright("failed to initialize ai service"),
        error.message
      );
      throw error;
    }
  }

  async getMessages(message, tools = undefined) {
    let fullResponse = "";
    await this.sendMessages(message, (chunk) => {
      fullResponse += chunk;
    });

    return fullResponse;
  }
}
