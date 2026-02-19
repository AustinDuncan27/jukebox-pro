import express from "express";
const router = express.Router();

import { createUser, getUserByUsername, verifyUserPassword } from "#db/queries/users";
import { createToken } from "#utils/jwt";

router.post("/register", async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).send("Request body is required!");
    }
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Missing fields: username and password are required!");
    }
    const user = await createUser(username, password);
    const token = createToken({ id: user.id });
    res.status(201).send({ token });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).send("Request body is required!");
    }
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Missing fields: username and password are required!");
    }
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).send("Invalid credentials!");
    }
    const validPassword = await verifyUserPassword(user, password);
    if (!validPassword) {
      return res.status(401).send("Invalid credentials!");
    }
    const token = createToken({ id: user.id });
    res.send({ token });
  } catch (err) {
    next(err);
  }
});

export default router;