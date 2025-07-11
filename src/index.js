require("dotenv").config({ path: "./.env" });

const express = require("express");
const { connectDB } = require("./db");
const app = express();

// Connect to MongoDB
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
