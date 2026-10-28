const { prisma } = require("../db/config");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const saltRounds = 10 
app.use(express.json());


app.get("/users", (req, res) => {
  res.json({ ok: 200 });
});




app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password.trim()
  ) {
    return res.status(401).json({ error: "Invalid Credentials" });
  }
  let user = await prisma.user.findUnique({
    where: {
      username: username.trim()
    }
  });
  if (!user) {
    return res.status(401).json({ error: "Invalid Credentials" });
  }
  let userCC = await bcrypt.compare(password, user.password);
  if (!userCC) {
    return res.status(401).json({ error: "Invalid Credentials" });
  }
  res.status(200).json({ message: "logged in succesfully" });
});




app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (
    typeof username.trim() !== "string" ||
    typeof password.trim() !== "string" ||
    !username.trim() ||
    !password.trim()
  ) {
    res.status(401).json({ error: "Invalid Credentials" });
    return;
  }

  let hashedpass = await bcrypt.hash(password, saltRounds);

  await prisma.user.create({
    data: {
      username: username,
      password: hashedpass,
    },
  });
  res.status(201).json({"message":"added user"})
});




app.listen(3007, () => {
  console.log("running on port 3007");
});
