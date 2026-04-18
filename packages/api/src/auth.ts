import { randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

export type PublicUser = {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
};

type StoredUser = PublicUser & {
  passwordSalt: string;
  passwordHash: string;
};

const usersByUsername = new Map<string, StoredUser>();
const accessTokenToUsername = new Map<string, string>();

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 32).toString("hex");
}

function verifyPassword(password: string, salt: string, expectedHex: string) {
  const actual = Buffer.from(hashPassword(password, salt), "hex");
  const expected = Buffer.from(expectedHex, "hex");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function register(username: string, email: string, password: string) {
  if (usersByUsername.has(username)) {
    const err = new Error("Username already exists");
    (err as any).status = 400;
    throw err;
  }
  const salt = randomUUID();
  const user: StoredUser = {
    id: usersByUsername.size + 1,
    username,
    email,
    first_name: "",
    last_name: "",
    passwordSalt: salt,
    passwordHash: hashPassword(password, salt),
  };
  usersByUsername.set(username, user);

  const access = randomUUID();
  const refresh = randomUUID();
  accessTokenToUsername.set(access, username);

  return { user: toPublicUser(user), access, refresh };
}

export function login(username: string, password: string) {
  const user = usersByUsername.get(username);
  if (!user) {
    const err = new Error("Invalid username or password");
    (err as any).status = 401;
    throw err;
  }
  if (!verifyPassword(password, user.passwordSalt, user.passwordHash)) {
    const err = new Error("Invalid username or password");
    (err as any).status = 401;
    throw err;
  }

  const access = randomUUID();
  const refresh = randomUUID();
  accessTokenToUsername.set(access, username);

  return { user: toPublicUser(user), access, refresh };
}

export function me(authorizationHeader: string | undefined): PublicUser {
  const token = parseBearer(authorizationHeader);
  if (!token) {
    const err = new Error("Not authenticated");
    (err as any).status = 401;
    throw err;
  }
  const username = accessTokenToUsername.get(token);
  if (!username) {
    const err = new Error("Invalid token");
    (err as any).status = 401;
    throw err;
  }
  const user = usersByUsername.get(username);
  if (!user) {
    const err = new Error("Invalid token");
    (err as any).status = 401;
    throw err;
  }
  return toPublicUser(user);
}

export function logout(refreshToken: string | null | undefined) {
  // In this demo we don't track refresh tokens; accept request and return ok.
  void refreshToken;
  return { ok: true };
}

function toPublicUser(u: StoredUser): PublicUser {
  const { passwordHash: _ph, passwordSalt: _ps, ...pub } = u;
  return pub;
}

function parseBearer(header: string | undefined): string | null {
  if (!header) return null;
  const [kind, token] = header.split(" ");
  if (kind !== "Bearer" || !token) return null;
  return token;
}

