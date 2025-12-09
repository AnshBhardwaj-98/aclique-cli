import chalk from "chalk";
import prisma from "../../lib/db.js";
import { intro, isCancel, outro, text } from "@clack/prompts";
import yoctoSpinner from "yocto-spinner";
import boxen from "boxen";
import { marked } from "marked";
import { markedTerminal } from "marked-terminal";
import { aiService } from "../ai/google-service.js";
import { chatService } from "../../service/chat.service.js";
import { getStoredToken } from "../../lib/token.js";

marked.use(
  markedTerminal({
    code: chalk.cyan,
    blockquote: chalk.gray.italic,
    heading: chalk.green.bold,
    firstHeading: chalk.magenta.underline.bold,
    hr: chalk.reset,
    list: chalk.reset,
    listitem: chalk.reset,
    paragraph: chalk.reset,
    strong: chalk.bold,
    em: chalk.italic,
    codespan: chalk.yellow.bgBlack,
    del: chalk.dim.gray.strikethrough,
    link: chalk.blue.underline,
    href: chalk.blue.underline,
  })
);

const newAiService = new aiService();
const aiChatService = new chatService();

async function getUserFromToken() {
  const token = await getStoredToken();
  if (!token?.access_token) {
    throw new Error("Not authenticated. Please run aclique login.");
  }

  const spinner = yoctoSpinner({ text: "authenticating..." }).start();
  const user = await prisma.user.findFirst({
    where: {
      sessions: {
        some: {
          token: token.access_token,
        },
      },
    },
  });

  if (!user) {
    spinner.error("user not found");
    throw new Error("User not found. Please login again");
  }

  spinner.success(`welcome back, ${user.name}!`);
  return user;
}

async function initConversation(userId, conversationId = null, mode = "chat") {
  const spinner = yoctoSpinner({ text: "loading conversation..." }).start();
  const conversation = await aiChatService.getOrCreateConversation(
    userId,
    conversationId,
    mode
  );
  spinner.success("conversation loaded");
  const conversationInfo = boxen(
    `${chalk.bold("Conversation")}: ${conversation.title}\n${chalk.gray(
      "ID: " + conversation.id
    )}\n${chalk.gray("Mode: " + conversation.mode)}`,
    {
      padding: 1,
      margin: { top: 1, bottom: 1 },
      borderColor: "cyan",
      borderStyle: "round",
      title: "💬Chat Session🗨️",
      titleAlignment: "center",
    }
  );
  console.log(conversationInfo);

  if (conversation.messages?.length > 0) {
    console.log(chalk.yellow("Previous Message:\n"));
    displayMessage(conversation.messages);
  }

  return conversation;
}

function displayMessage(messages) {
  messages.forEach((msg) => {
    if (msg.role === "user") {
      const userBox = boxen(chalk.white(msg.content), {
        padding: 1,
        margin: { left: 2, bottom: 1 },
        borderStyle: "round",
        borderColor: "blue",
        title: "👤 You",
        textAlignment: "left",
      });

      console.log(userBox);
    } else {
      const renderedContent = marked.parse(msg.content);
      const aiBox = boxen(renderedContent.trim(), {
        padding: 1,
        margin: { left: 2, bottom: 1 },
        borderStyle: "round",
        borderColor: "green",
        title: "🤖 AI",
        textAlignment: "left",
      });

      console.log(aiBox);
    }
  });
}

async function saveMessage(conversationId, role, content) {
  return await aiChatService.addMessage(conversationId, role, content);
}

async function getAiResponse(conversationId) {
  const spinner = yoctoSpinner({
    text: "AI is thinking...",
    color: "cyan",
  }).start();
  const dbMessage = await aiChatService.getMessages(conversationId);

  let fullResponse = "";

  let isFirstChunk = true;

  try {
    const result = await newAiService.sendMessages(dbMessage, (chunk) => {
      if (isFirstChunk) {
        spinner.stop();
        console.log("\n");
        console.log(chalk.green.bold("🤖 AI"));
        console.log(chalk.gray("-".repeat(60)));
        isFirstChunk = false;
      }
      fullResponse += chunk;
    });

    console.log("\n");
    const renderedMarkdown = marked.parse(fullResponse);
    console.log(renderedMarkdown);
    console.log(chalk.gray("-".repeat(60)));
    console.log("\n");

    return result.content;
  } catch (error) {
    spinner.error("failed to get ai response");
    throw error;
  }
}

async function chatLoop(conversation) {
  const helpBox = boxen(
    `${chalk.yellow("• Type and press enter to start")}\n${chalk.yellow(
      "• Type exit to exit or press ctrl+c"
    )}`,
    {
      padding: 1,
      margin: { top: 1, bottom: 1 },
      borderStyle: "round",
      borderColor: "cyan",
      backgroundColor: "#0d0d0d",
    }
  );

  console.log(helpBox);
  while (true) {
    const userInput = await text({
      message: chalk.blue("Your message"),
      placeholder: "Type your Message...",
      validate(value) {
        if (!value || value.trim().length === 0) {
          return "Message cannot be empty";
        }
      },
    });

    if (isCancel(userInput)) {
      const exitBox = boxen(chalk.yellow("Chat session ended. Goodbye! 👋"), {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "yellowBright",
      });
      console.log(exitBox);
      process.exit(0);
    }

    if (userInput.toLowerCase() === "exit") {
      const exitBox = boxen(chalk.yellow("Chat session ended. Goodbye! 👋"), {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "yellowBright",
      });
      console.log(exitBox);
      break;
    }

    await saveMessage(conversation.id, "user", userInput);

    const message = await aiChatService.getMessages(conversation.id);

    const aiResponse = await getAiResponse(conversation.id);

    await saveMessage(conversation.id, "assistant", aiResponse);
  }
}

export async function startChat(mode = "chat", conversationId = null) {
  console.log("inside startchat");

  try {
    intro(
      boxen(chalk.bold.cyan("Aclique AI Chat"), {
        padding: 1,
        borderColor: "cyanBright",
        borderStyle: "double",
      })
    );

    const user = await getUserFromToken();
    const conversation = await initConversation(user.id, conversationId, mode);
    await chatLoop(conversation);

    outro(chalk.green("🟢 Thanks for chatting"));
  } catch (e) {
    const errorBox = boxen(chalk.red(`Error: ${e.message}`), {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "redBright",
    });
    console.log(errorBox);
    process.exit(1);
  }
}
