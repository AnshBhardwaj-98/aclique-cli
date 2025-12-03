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
import { resolve } from "node:path";
import { rejects } from "node:assert";
import {
  getStoredToken,
  isTokenExpired,
  storeToken,
} from "../../../lib/token.js";

dotenv.config();
const URL = "http://localhost:3010";
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const CONFIG_DIR = path.join(os.homedir(), ".better-auth");
export const TOKEN_DIR = path.join(CONFIG_DIR, "token.json");

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
  const existingToken = await getStoredToken();
  const expired = await isTokenExpired();

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
        verification_uri_complete || verification_uri
      )}`
    );
    console.log(`Code: ${chalk.bold.green(user_code)}`);

    const shouldOpen = await confirm({
      message: "Open URL?",
      initialValue: true,
    });
    if (!isCancel(shouldOpen) && shouldOpen) {
      const urlToOpen = verification_uri_complete || verification_uri;
      await open(urlToOpen);
    }
    console.log(
      chalk.gray(
        `Waiting for authorization, expires in ${Math.floor(
          expires_in / 60
        )} minutes... `
      )
    );

    const token = await pollForToken(
      authClient,
      device_code,
      clientId,
      interval
    );

    if (token) {
      const saved = await storeToken(token);
      if (!saved) {
        console.log(chalk.yellow("Warning: Failed to store Access Token"));
        console.log(chalk.yellow("You may need to login again"));
      }

      outro(chalk.green("Login Successful"));
      console.log(chalk.gray(`token saved at: ${TOKEN_DIR}`));
    }
  } catch (error) {
    spinner.stop();

    console.error(chalk.red("Login failed"), error.message);
    process.exit(1);
  }

  //EOF
}

async function pollForToken(
  authClient,
  device_code,
  clientId,
  initialInterval
) {
  let pollingInterval = initialInterval;
  const spinner = yoctoSpinner({ text: "", color: "green" });
  let dots = 0;

  return new Promise((resolve, reject) => {
    const poll = async () => {
      dots = (dots + 1) % 4;
      spinner.text = chalk.gray(
        `Polling for authorization ${".".repeat(dots)}${" ".repeat(3 - dots)}`
      );
      if (!spinner.isSpinning) spinner.start();

      try {
        const { data, error } = await authClient.device.token({
          grant_type: "urn:ietf:params:oauth:grant-type:device_code",
          device_code: device_code,
          client_id: clientId,
        });

        if (data?.access_token) {
          spinner.stop();
          resolve(data);
          return;
        }

        if (error) {
          switch (error.error) {
            case "authorization_pending":
              break;

            case "slow_down":
              pollingInterval += 5;
              break;

            case "access_denied":
              spinner.stop();
              console.error("Access denied by user");
              reject(error);
              return;

            case "expired_token":
              spinner.stop();
              console.error("The device code expired.");
              reject(error);
              return;

            default:
              spinner.stop();
              console.error("Unexpected error:", error.error_description);
              reject(error);
              return;
          }
        }
      } catch (err) {
        spinner.stop();
        reject(err);
        return;
      }

      setTimeout(poll, pollingInterval * 1000);
    };

    setTimeout(poll, pollingInterval * 1000);
  });
}

// ----------------
// Commander Setup
// ----------------

export const login = new Command("login")
  .description("login to Aclique-CLI")
  .option("--server-url <url>", "The better-auth server url", URL)
  .option("--client-id <id>", "The o-auth client id", CLIENT_ID)
  .action(loginAction);
