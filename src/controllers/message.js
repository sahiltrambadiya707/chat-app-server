const httpStatus = require("http-status");
const Message = require("../models/message");
const User = require("../models/user");
const Chat = require("../models/chat");

const sendMessage = async (req, res, next) => {
  const { content, chatId } = req.body;
  try {
    if (!content || !chatId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.status(httpStatus.OK).send(message);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

const allMessages = async (req, res, next) => {
  try {
    await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat")
      .then((data) => {
        res.status(httpStatus.OK).send(data);
      })
      .catch((error) => {
        return res.status(httpStatus.BAD_REQUEST).send(error);
      });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

module.exports = {
  sendMessage,
  allMessages,
};
