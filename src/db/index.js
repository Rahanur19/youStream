const mongoose = require("mongoose");
const { DB_NAME } = require("../constants");

const connectDB = async () => {
  try {
    const db = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    // console.log(db);
    // console.log(db.connection);
    console.log(
      `MongoDB connected successfully !!. Host : ${db.connection.host}`
    );
  } catch (error) {
    console.error(`Coudn't connect to mongoDB: ${error}`);
    process.exit(1);
  }
};

module.exports = { connectDB };
