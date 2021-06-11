const express = require("express");
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

const port = process.env.PORT || 5000;
const hostname = process.env.HOST_NAME;

app.use(cors());

app.use(express.json({ extended: false }));

connectDB();

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

app.use("/", (request, response) => {
  response.send("Welcome To DevConnector");
});

app.listen(port, hostname, () => {
  console.log(`Server is Started at http://${hostname}:${port}`);
});
