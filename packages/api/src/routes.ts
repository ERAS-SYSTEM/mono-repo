import { Router } from "express";
import { createContact, deleteContact, listContacts } from "./services";
import { login, logout, me, register } from "./auth";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

router.post("/auth/register/", (req, res) => {
  const { username, email, password } = req.body ?? {};
  if (typeof username !== "string" || typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "username, email, password are required" });
  }
  try {
    res.json(register(username, email, password));
  } catch (e) {
    const status = typeof (e as any).status === "number" ? (e as any).status : 500;
    res.status(status).json({ error: (e as Error).message });
  }
});

router.post("/auth/login/", (req, res) => {
  const { username, password } = req.body ?? {};
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "username and password are required" });
  }
  try {
    res.json(login(username, password));
  } catch (e) {
    const status = typeof (e as any).status === "number" ? (e as any).status : 500;
    res.status(status).json({ error: (e as Error).message });
  }
});

router.get("/auth/me/", (req, res) => {
  try {
    res.json(me(req.header("authorization")));
  } catch (e) {
    const status = typeof (e as any).status === "number" ? (e as any).status : 500;
    res.status(status).json({ error: (e as Error).message });
  }
});

router.post("/auth/logout/", (req, res) => {
  const { refresh } = req.body ?? {};
  res.json(logout(typeof refresh === "string" ? refresh : null));
});

router.get("/contacts", async (_req, res) => {
  try {
    const data = await listContacts();
    res.json(data);
  } catch (e) {
    res.status(503).json({ error: (e as Error).message });
  }
});

router.post("/contacts", async (req, res) => {
  const { name, phone, email } = req.body ?? {};
  if (typeof name !== "string" || typeof phone !== "string") {
    return res.status(400).json({ error: "name and phone are required" });
  }
  try {
    const created = await createContact({ name, phone, email });
    res.json(created);
  } catch (e) {
    res.status(503).json({ error: (e as Error).message });
  }
});

router.delete("/contacts/:id", async (req, res) => {
  try {
    await deleteContact(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(503).json({ error: (e as Error).message });
  }
});

export default router;

