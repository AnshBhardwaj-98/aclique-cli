import { Command } from "commander";
import { clearToken, getStoredToken } from "../../../lib/token.js";
import chalk from "chalk";

async function logOutActions() {
  const token = await getStoredToken();
  if (!token) {
    console.log(chalk.redBright("You are not logged in"));
    process.exit(0);
  }
  try {
    const tokenDelete = await clearToken();
    if (tokenDelete) {
      console.log(chalk.redBright("logged out successfully"));
      process.exit(0);
    }
  } catch (error) {
    console.log(chalk.redBright("Failed to log-out"), error);
    process.exit(1);
  }
}

export const logout = new Command("logout")
  .description("Logout from Aclique-CLI")
  .action(logOutActions);
