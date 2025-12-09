import chalk from "chalk";
import { Command } from "commander";
import prisma from "../../../lib/db.js";
import { getStoredToken } from "../../../lib/token.js";
import { select } from "@clack/prompts";
import yoctoSpinner from "yocto-spinner";
import { startChat } from "../../chat/user-ai-chat.js";

const initActions = async () => {
  const token = await getStoredToken();
  if (!token) {
    console.log(chalk.redBright("Authentication failed, please login"));
    return;
  }
  const spinner = yoctoSpinner({ text: "Fetching user detailes..." });
  spinner.start();
  const user = await prisma.user.findFirst({
    where: {
      sessions: {
        some: {
          token: token.access_token,
        },
      },
    },
    select: {
      email: true,
      name: true,
      image: true,
      id: true,
    },
  });
  spinner.stop();

  if (!user) {
    console.log(chalk.redBright("user not found."));
    return;
  }

  console.log(chalk.greenBright(`welcome ${user.name}`));

  const choice = await select({
    message: "select a feature:",
    options: [
      { value: "chat", label: "Chat", hint: "chat with ai" },
      {
        value: "tool",
        label: "Tool Calling",
        hint: "Use Tools like Google Search, code execution",
      },
      { value: "agentic", label: "Agentic AI", hint: "Upcoming feature" },
    ],
  });

  switch (choice) {
    case "chat":
      startChat("chat");
      break;
    case "tool":
      console.log("tools ");
      break;
    case "agentic":
      console.log("agentic ");
      break;
    default:
      console.log("no option is selected");
      break;
  }
};
export const init = new Command("init")
  .description("initialize the ai")
  .action(initActions);
