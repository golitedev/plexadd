import crypto from "node:crypto";
import { cookies } from "next/headers";
import { getRequiredEnv } from "@/lib/env";

const adminCookieName = "plexadd_admin";
const cookieDurationSeconds = 60 * 60 * 24 * 30;

type SessionPayload = {
  username: string;
  expiresAt: number;
};

function encode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function timingSafeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export async function createAdminSession() {
  const { adminSessionSecret, adminUsername } = getRequiredEnv();
  const expiresAt = Date.now() + cookieDurationSeconds * 1000;
  const payload = encode(JSON.stringify({ username: adminUsername, expiresAt }));
  const signature = sign(payload, adminSessionSecret);
  const cookieStore = await cookies();

  cookieStore.set(adminCookieName, `${payload}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: cookieDurationSeconds,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(adminCookieName);
}

export async function isAdminAuthenticated() {
  const { adminSessionSecret, adminUsername } = getRequiredEnv();

  if (!adminSessionSecret || !adminUsername) {
    return false;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value;

  if (!token) {
    return false;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return false;
  }

  if (!timingSafeEqual(sign(payload, adminSessionSecret), signature)) {
    return false;
  }

  const parsed = JSON.parse(decode(payload)) as SessionPayload;

  if (parsed.username !== adminUsername || parsed.expiresAt < Date.now()) {
    return false;
  }

  return true;
}

export function areAdminCredentialsValid(inputUsername: string, inputPassword: string) {
  const { adminUsername, adminPassword } = getRequiredEnv();

  return timingSafeEqual(inputUsername, adminUsername) && timingSafeEqual(inputPassword, adminPassword);
}
