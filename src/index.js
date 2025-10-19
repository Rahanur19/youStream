require("dotenv").config({ path: "./.env" });
const { connectDB } = require("./db");
const { app } = require("./app");

// Connect to MongoDB
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  });
