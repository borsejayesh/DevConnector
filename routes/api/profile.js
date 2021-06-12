const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const auth = require("../../middlewares/Auth");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

router.post(
  "/",
  auth,
  [
    body("status").notEmpty().withMessage("Status is Required"),
    body("skills").notEmpty().withMessage("Skills is Required"),
  ],
  async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    let {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      youtube,
      twitter,
      facebook,
      instagram,
      linkdin,
    } = request.body;

    let profileFields = {};
    profileFields.user = request.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;

    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (instagram) profileFields.social.instagram = instagram;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkdin) profileFields.social.linkdin = linkdin;

    try {
      let profile = await Profile.findOne({ user: request.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: request.user.id },
          { $set: profileFields },
          { new: true }
        );
        return response.status(200).json(profile);
      }

      profile = new Profile(profileFields);

      response.status(200).json(profile);
      await profile.save();
    } catch (error) {
      console.error(error.msg);
      response.status(500).send("Server Error");
    }
  }
);

router.get("/", async (request, response) => {
  let profile = await Profile.find();
  response.status(200).json(profile);
  console.log(profile);
});

router.get("/me", auth, async (request, response) => {
  let profile = await Profile.findOne({ user: request.user.id });
  response.status(200).json(profile);
  console.log(profile);
});

module.exports = router;
