import fs from "node:fs/promises";
import { CONFIG_DIR, TOKEN_DIR } from "../cli/commands/auth/login.js";
import chalk from "chalk";

export async function getStoredToken() {
  try {
    const data = await fs.readFile(TOKEN_DIR, "utf-8");
    const token = JSON.parse(data);
    return token;
  } catch (error) {
    return null;
  }
}

export async function storeToken(token) {
  try {
    await fs.mkdir(CONFIG_DIR, { recursive: true });

    const tokenData = {
      access_token: token.access_token,
      refresh_token: token.refresh_token ?? null,
      expires_at: token.expires_in
        ? new Date(Date.now() + token.expires_in * 1000).toISOString()
        : null,
      created_at: Date.now(),
      user_id: token.user?.id ?? null,
      scope: token.scope ?? [],
      token_type: token.token_type ?? "Bearer",
    };

    await fs.writeFile(TOKEN_DIR, JSON.stringify(tokenData, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.log("Failed to store Token", error);
  }
}

export async function clearToken() {
  try {
    await fs.unlink(TOKEN_DIR);
    return true;
  } catch (error) {
    return false;
  }
}

export async function isTokenExpired() {
  const token = await getStoredToken();
  if (!token || !token.expires_at) return true;

  const expires = new Date(token.expires_at);
  const now = new Date();

  return expires.getTime() - now.getTime() < 5 * 60 * 1000;
}

export async function requiredAuth() {
  const token = await getStoredToken();
  if (!token) {
    console.log(
      chalk.red("Not Authenticated, pleare run aclique login to authenticate")
    );
    process.exit(1);
  }

  if (await isTokenExpired()) {
    console.log(chalk.yellow("Session Expired. Please login again"));
    process.exit(1);
  }

  return token;
}
