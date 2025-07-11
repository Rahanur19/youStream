const mongoose = require("mongoose");
const { DB_NAME } = require("../constants");

const connectDB = async () => {
  try {
    const db = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(
      `MongoDB connected successfully !!. Host : ${db.connection.host}`
    );

    // Handle error after connection
    db.connection.on("error", (err) => {
      console.error(`Error after connection: ${err}`);
      process.exit(1);
    });
  } catch (error) {
    console.log(`mongoDB connection FAILED : ${error}`);
    process.exit(1);
  }
};

module.exports = { connectDB };
