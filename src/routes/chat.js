const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const Chat = require("../controllers/chat");

router.route("/chat").post(protect, Chat.accessChat).get(protect, Chat.fetchChat);
router.route("/chat/group").post(protect, Chat.createChats);
router.route("/chat/rename").put(protect, Chat.renameGroup);
router.route("/chat/groupadd").put(protect, Chat.addToGroup);
router.route("/chat/groupremove").put(protect, Chat.removeFromGroup);

module.exports = router;
