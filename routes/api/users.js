const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const User = require("../../models/User");
const auth = require("../../middlewares/Auth");

const avatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Please Enter Valid Name"),
    body("email").isEmail().withMessage("Please Enter Valid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Please Enter min 6 charactors"),
  ],
  async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    let { name, email, password } = request.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return response
          .status(400)
          .json({ errors: [{ msg: "User Alredy Exists" }] });
      }

      let image = avatar.url(email, {
        s: 200,
        r: "pg",
        d: "mm",
      });

      let salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      user = new User({
        name,
        email,
        password,
        image,
      });

      await user.save();
      return response.status(200).send("Registration Successfull");
    } catch (error) {
      response.status(500).send("Server Error");
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid Email"),
    body("password").exists().withMessage("Enter Valid password"),
  ],
  async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    let { email, password } = request.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return response
          .status(401)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      let isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return response
          .status(401)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, process.env.jwtSecret, (err, token) => {
        if (err) throw err;

        return response.json({ token });
      });
    } catch (error) {
      response.status(500).send("Server Error");
    }
  }
);

module.exports = router;
