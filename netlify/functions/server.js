const serverless = require("serverless-http");
const dotenv = require("dotenv");

// Load env from project root .env
dotenv.config({ path: "./.env" });

const { connectDB } = require("../../src/db");
const { app } = require("../../src/app");

// Connect to DB once at function cold-start
let dbConnected = false;
const ensureDB = async () => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
};

module.exports.handler = serverless(async (req, res) => {
  await ensureDB();
  // serverless-http expects an express app; export handler
  return app(req, res);
});
