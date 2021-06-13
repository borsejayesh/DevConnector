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

router.get("/", auth, async (request, response) => {
  try {
    let posts = await Post.find().sort({ date: -1 });
    response.json(posts);
  } catch (error) {
    console.error(error.msg);
    response.status(500).send("Server Error");
  }
});

router.get("/:id", auth, async (request, response) => {
  try {
    let post = await Post.findById(request.params.id);

    if (!post) {
      return response.status(404).json({ msg: "Post Not Found" });
    }

    response.json(post);
  } catch (error) {
    console.error(error.msg);
    if (error.kind === "ObjectId") {
      return response.status(404).json({ msg: "Post Not Found" });
    }
    response.status(500).send("Server Error");
  }
});

router.delete("/:id", auth, async (request, response) => {
  try {
    let post = await Post.findById(request.params.id);

    if (!post) {
      return response.status(404).json({ msg: "Post Not Found" });
    }

    if (post.user.toString() !== request.user.id) {
      return response.status(401).json({ msg: "User Not Authorized" });
    }

    await post.remove();
    response.json({ msg: "deleted" });
  } catch (error) {
    console.error(error.msg);
    if (error.kind === "ObjectId") {
      return response.status(404).json({ msg: "Post Not Found" });
    }
    response.status(500).send("Server Error");
  }
});

router.put("/like/:id", auth, async (request, response) => {
  try {
    let post = await Post.findById(request.params.id);
    if (
      post.likes.filter((like) => like.user.toString() === request.user.id)
        .length > 0
    ) {
      return response.status(400).json({ msg: "Post Already Liked" });
    }

    post.likes.unshift({ user: request.user.id });
    await post.save();

    response.json(post.likes);
  } catch (error) {
    console.error(error.msg);
    response.status(500).send("Server Error");
  }
});

router.put("/unlike/:id", auth, async (request, response) => {
  try {
    let post = await Post.findById(request.params.id);
    if (
      post.likes.filter((like) => like.user.toString() === request.user.id)
        .length === 0
    ) {
      return response.status(400).json({ msg: "Post has not been liked yet" });
    }

    let removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(request.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    response.json(post.likes);
  } catch (error) {
    console.error(error.msg);
    response.status(500).send("Server Error");
  }
});

router.post(
  "/comment/:id",
  [auth, [body("text").notEmpty().withMessage("Text is required")]],
  async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findById(request.user.id).select("-password");
      let post = await Post.findById(request.params.id);

      let newComment = {
        text: request.body.text,
        name: user.name,
        image: user.image,
        user: request.user.id,
      };

      post.comments.unshift(newComment);
      await post.save();
      response.json(post.comments);
    } catch (error) {
      console.error(error.msg);
      response.status(500).send("Server Error");
    }
  }
);

router.delete("/comment/:id/:comment_id", auth, async (request, response) => {
  try {
    let post = await Post.findById(request.params.id);

    let comment = post.comments.find(
      (comment) => comment.id === request.params.comment_id
    );

    if (!comment) {
      return response.status(404).json({ msg: "Comment Does Not Exists" });
    }

    if (comment.user.toString() !== request.user.id) {
      return response.status(401).json({ msg: "User Not Authorized" });
    }

    let removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(request.user.id);

    post.comments.splice(removeIndex, 1);
    await post.save();

    response.json(post.comments);
  } catch (error) {
    console.error(error.msg);
    response.status(500).send("Server Error");
  }
});

module.exports = router;
