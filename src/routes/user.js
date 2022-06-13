const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const User = require("../controllers/user");

router.route("/user/login").post(User.loginUser);
router.route("user/register").post(User.registerUser);
router.route("/user").get(protect, User.allUser);

module.exports = router;
