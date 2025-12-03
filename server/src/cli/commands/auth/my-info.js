import { Command } from "commander";
import { getStoredToken } from "../../../lib/token.js";
import chalk from "chalk";
import prisma from "../../../lib/db.js";

export async function myInfoAction() {
  const token = getStoredToken();
  if (!token) {
    console.log(chalk.redBright("you are not logged in"));
    console.log(chalk.redBright("Run aclique login to login"));
    process.exit(1);
  }

  const user = await prisma.user.findFirst({
    where: {
      sessions: {
        some: {
          token: token.access_token,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  console.log(
    chalk.bold.greenBright(
      `\n Email: ${user.email} \n Name: ${user.name} \n ID: ${user.id}`
    )
  );
}

export const my_info = new Command("my_info")
  .description("user information")
  .action(myInfoAction);
