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
  try {
    let profiles = await Profile.find().populate("user", ["name", "image"]);
    response.status(200).json(profiles);
  } catch (error) {
    console.error(error.msg);
    response.status(500).send("Server Error");
  }
});

router.get("/me", auth, async (request, response) => {
  try {
    let profile = await Profile.findOne({ user: request.user.id }).populate(
      "user",
      ["name", "image"]
    );

    if (!profile) {
      return response
        .status(400)
        .json({ msg: "There is No Profile for this User" });
    }
    response.status(200).json(profile);
  } catch (error) {
    console.error(error.msg);
    response.status(500).send("Server Error");
  }
});

router.get("/user/:id", async (request, response) => {
  try {
    let profile = await Profile.findOne({ user: request.params.id }).populate(
      "user",
      ["name", "image"]
    );

    if (!profile) {
      return response.status(400).json({ msg: "Profile Not Found" });
    }

    response.status(200).json(profile);
  } catch (error) {
    console.error(error.msg);
    if (error.kind == "ObjectId") {
      return response.status(400).json({ msg: "Profile Not Found" });
    }
    response.status(500).send("Server Error");
  }
});

router.delete("/", auth, async (request, response) => {
  try {
    await Profile.findOneAndRemove({ user: request.user.id });

    response.json({ msg: "Profile Deleted" });
  } catch (error) {
    response.status(500).send("Server error");
  }
});

router.put(
  "/experience",
  [auth, [body("title").notEmpty().withMessage("Title is Required")]],
  async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    let { title, company, location, from, to, current, description } =
      request.body;

    let newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      let profile = await Profile.findOne({ user: request.user.id });

      profile.experience.unshift(newExp);

      await profile.save();
      response.json({ msg: "Experience Saved" });
    } catch (error) {
      console.error(error.msg);
      response.status(500).send("Server Error");
    }
  }
);

router.delete("/experience/:id", auth, async (request, response) => {
  try {
    let profile = await Profile.findOne({ user: request.user.id });

    let removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(request.param.id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();
    response.json(profile);
  } catch (error) {
    console.error(error.msg);
    response.status(500).send("Server Error");
  }
});

router.put(
  "/education",
  [
    auth,
    [
      body("school").notEmpty().withMessage("School is Required"),
      body("degree").notEmpty().withMessage("Degree is Required"),
      body("fieldofstudy").notEmpty().withMessage("Field of Study is Required"),
      body("from").notEmpty().withMessage("From is Required"),
    ],
  ],
  async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    let { school, degree, fieldofstudy, from, to, current, description } =
      request.body;

    let newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      let profile = await Profile.findOne({ user: request.user.id });

      profile.education.unshift(newEdu);

      await profile.save();
      response.json({ msg: "Education Saved" });
    } catch (error) {
      console.error(error.msg);
      response.status(500).send("Server Error");
    }
  }
);

router.delete("/education/:id", auth, async (request, response) => {
  try {
    let profile = await Profile.findOne({ user: request.user.id });

    let removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(request.param.id);

    profile.education.splice(removeIndex, 1);

    await profile.save();
    response.json(profile);
  } catch (error) {
    console.error(error.msg);
    response.status(500).send("Server Error");
  }
});

module.exports = router;
