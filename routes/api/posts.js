const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const auth = require("../../middlewares/Auth");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

router.post(
  "/",
  [auth, [body("text").notEmpty().withMessage("Text is required")]],
  async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findById(request.user.id).select("-password");

      let newPost = new Post({
        text: request.body.text,
        name: user.name,
        image: user.image,
        user: request.user.id,
      });

      let post = await newPost.save();
      response.json(post);
    } catch (error) {
      console.error(error.msg);
      response.status(500).send("Server Error");
    }
  }
);

module.exports = router;
