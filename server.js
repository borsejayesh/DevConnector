const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

const port = process.env.PORT || 5000;
const hostname = process.env.HOST_NAME;

app.use(cors());

app.use(express.json({ extended: false }));

(async () => {
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
})();

app.use("/", (request, response) => {
  response.send("Welcome To DevConnector");
});

app.listen(port, hostname, () => {
  console.log(`Server is Started at http://${hostname}:${port}`);
});
