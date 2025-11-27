import { intro, confirm, outro, cancel, isCancel } from "@clack/prompts";
import { createAuthClient } from "better-auth/client";
import { deviceAuthorizationClient } from "better-auth/client/plugins";
import chalk from "chalk";
import { Command } from "commander";
import fs from "node:fs/promises";
import open from "open";
import os from "os";
import path from "path";
import yoctoSpinner from "yocto-spinner";
import * as z from "zod/v4";
import dotenv from "dotenv";
import prisma from "../../../lib/db.js";
import { logger } from "better-auth";

dotenv.config();
const URL = "http://localhost:3010";
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CONFIG_DIR = path.join(os.homedir(), ".better-auth");
const TOKEN_DIR = path.join(CONFIG_DIR, "token.json");

async function loginAction(opts) {
  //SOF

  const options = z.object({
    serverUrl: z.string().optional(),
    clientId: z.string().optional(),
  });

  const serverUrl = options.serverUrl || URL;
  const clientId = options.clientId || CLIENT_ID;

  intro(chalk.bold("Auth CLI login"));

  //WIP: change below with token managment
  const existingToken = false;
  const expired = false;

  if (existingToken && !expired) {
    const shouldReAuth = await confirm({
      message: "You are already logged in -- Login again? ",
      initialValue: false,
    });

    if (isCancel(shouldReAuth) && !shouldReAuth) {
      cancel("Login Cancelled");
      process.exit(0);
    }
  }
  const authClient = createAuthClient({
    baseURL: serverUrl,
    plugins: [deviceAuthorizationClient()],
  });

  const spinner = yoctoSpinner({ text: "Requesting device authorization..." });
  spinner.start();

  try {
    const { data, error } = await authClient.device.code({
      client_id: clientId, // required
      scope: "openid profile email",
    });

    if (error || !data) {
      logger.error(
        `Failed to request device authorization: ${error.error_description}`
      );
      process.exit(1);
    }
    spinner.stop();
    const {
      device_code,
      expires_in,
      interval,
      user_code,
      verification_uri,
      verification_uri_complete,
    } = data;
    console.log(chalk.cyan("Device authorization required"));
    console.log(
      ` Please visit: ${chalk.underline.blue(
        verification_uri || verification_uri_complete
      )}`
    );
    console.log(`Code: ${chalk.bold.green(user_code)}`);

    const shouldOpen = await confirm({
      message: "Open URL?",
      initialValue: true,
    });
    if (!isCancel(shouldOpen) && shouldOpen) {
      const urlToOpen = verification_uri || verification_uri_complete;
      await open(urlToOpen);
    }
    console.log(
      chalk.gray(
        `Waiting for authorization, expires in ${Math.floor(
          expires_in / 60
        )} minutes... `
      )
    );
  } catch (error) {
    console.log(error);
  }

  //EOF
}

export const login = new Command("login")
  .description("login to Aclique-CLI")
  .option("--server-url <url>", "The better-auth server url", URL)
  .option("--client-id <id>", "The o-auth client id", CLIENT_ID)
  .action(loginAction);
