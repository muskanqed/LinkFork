const express = require("express");
const cors = require("cors");
const authRoutes = require("./modules/auth/auth.routes");
const cookieParse = require("cookie-parser")

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParse());

app.use("/auth", authRoutes);

app.listen(3001, () => {
  console.log("Server running on port 3001");
});