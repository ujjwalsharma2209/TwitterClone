const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./config/db");
const landingPageRoutes = require("./routes/landingPageRoutes");
const homePageRoutes = require("./routes/homePageRoutes");
const searchPageRoutes = require("./routes/searchPageRoutes");
const port = 8080;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/landing-page", landingPageRoutes);
app.use("/home-page", homePageRoutes);
app.use("/search-page", searchPageRoutes);

app.get("/", (req, res) => {
  res.send("Server is running...")
});

app.get("/landing-page", (req, res) => {
  res.sendFile(path.resolve("./public/landingPage.html"));
});

app.get("/home-page", (req, res) => {
  res.sendFile(path.resolve("./public/homePage.html"));
});

app.get("/search-page", (req, res) => {
  res.sendFile(path.resolve("./public/searchPage.html"));
})

app.listen(port, () => {
  console.log("Server started on port: " + port);
});
