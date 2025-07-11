require("dotenv").config({ path: "./.env" });
const { connectDB } = require("./db");
const { app } = require("./app");

// Connect to MongoDB
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  });
