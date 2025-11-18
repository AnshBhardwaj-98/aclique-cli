import express from "express";
import dotenv from "dotenv";
const app = express();

dotenv.config();

app.get("/healtz", (req, res) =>
  res.send("{{Aclique-CLI: Server running...}}")
);
app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
