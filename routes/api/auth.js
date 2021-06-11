const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
  response.send("Auth Router");
});

module.exports = router;
