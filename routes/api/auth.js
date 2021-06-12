const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/Auth");

const User = require("../../models/User");

router.get("/", [auth], async (request, response) => {
  try {
    let user = await User.findById(request.user.id).select("-password");

    return response.status(200).json({ user });
  } catch (error) {
    response.status(500).send("Server Error");
  }
});

module.exports = router;
