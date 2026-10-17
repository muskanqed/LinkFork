const express = require("express");
const cors = require("cors");
const authRoutes = require("./modules/auth/auth.routes");
const urlRoutes = require("./modules/url/url.routes");
const redirectRoutes = require("./modules/redirect/redirect.route");
const cookieParse = require("cookie-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParse());

app.use("/auth", authRoutes);
app.use("/urls", urlRoutes);
app.use("/", redirectRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});