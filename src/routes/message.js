const express = require("express");
const Message = require("../controllers/message");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.route("/message").post(protect, Message.sendMessage);
router.route("/message/:chatId").get(protect, Message.allMessages);

module.exports = router;
