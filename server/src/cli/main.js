#!/usr/bin/env node

import dotenv from "dotenv";
import figlet from "figlet";
import { Command } from "commander";
import chalk from "chalk";
import { login } from "./commands/auth/login.js";
import { logout } from "./commands/auth/logout.js";
import { my_info } from "./commands/auth/my-info.js";
import { init } from "./commands/ai/init.js";

dotenv.config();

async function main() {
  // SOF

  console.log(
    chalk.green(
      figlet.textSync("Aclique CLI", {
        horizontalLayout: "default",
        font: "standard",
      })
    )
  );
  console.log(chalk.red("A CLI based AI Tool"));

  const program = new Command("aclique");

  program.version("0.0.1").description("Aclique-CLI: A CLI based AI tool");
  program.addCommand(login);
  program.addCommand(logout);
  program.addCommand(my_info);
  program.addCommand(init);

  program.action(() => {
    program.help();
  });

  program.parse();
  //EOF
}

main().catch((err) => {
  console.log(chalk.red("error running aclique cli:"), err);
  process.exit(1);
});
