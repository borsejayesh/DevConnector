const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CLOUD_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
