const httpStatus = require("http-status");
const User = require("../models/user");
const Chat = require("../models/chat");
const Message = require("../models/message");

const accessChat = async (req, res, next) => {
  const { userId } = req.body;
  try {
    if (!userId) {
      return res.status(httpStatus.BAD_REQUEST).send("error");
    }
    const isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    }).populate([
      { path: "users", model: "User", select: "-password" },
      {
        path: "latestMessage",
        model: "Message",
        populate: {
          path: "sender",
          model: "User",
          select: "name pic email",
        },
      },
    ]);
    if (isChat?.length > 0) {
      res.status(httpStatus.OK).send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      try {
        const create = new Chat(chatData);
        const createdChat = await create.save();
        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate([
          { path: "users", model: "User", select: "-password" },
        ]);
        res.status(httpStatus.OK).send(fullChat);
      } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
      }
    }
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

const fetchChat = async (req, res, next) => {
  try {
    await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate([
        { path: "users", model: "User", select: "-password" },
        { path: "groupAdmin", model: "User", select: "-password" },
        {
          path: "latestMessage",
          model: "Message",
          populate: {
            path: "sender",
            model: "User",
            select: "name pic email",
          },
        },
      ])
      .sort({ updatedAt: -1 })
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

const createChats = async (req, res, next) => {
  if (!req.body.users || !req.body.name) {
    return res.status(httpStatus.BAD_REQUEST).send("Please fill all the felids");
  }

  const users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.status(httpStatus.BAD_REQUEST).send("More then 2 user are require for group chat");
  }
  users.push(req.user);
  try {
    const body = {
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    };
    const create = new Chat(body);
    const groupChat = await create.save();

    await Chat.find({ _id: groupChat._id })
      .populate([
        { path: "users", model: "User", select: "-password" },
        { path: "groupAdmin", model: "User", select: "-password" },
      ])
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

const renameGroup = async (req, res, next) => {
  const { chatId, chatName } = req.body;
  try {
    await Chat.findByIdAndUpdate(
      { _id: chatId },
      {
        $set: { chatName: chatName },
      },
      {
        new: true,
      }
    )
      .populate([
        { path: "users", model: "User", select: "-password" },
        { path: "groupAdmin", model: "User", select: "-password" },
      ])
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

const addToGroup = async (req, res, next) => {
  const { chatId, userId } = req.body;
  try {
    const added = await Chat.findByIdAndUpdate(
      { _id: chatId },
      { $push: { users: userId } },
      { new: true }
    ).populate([
      { path: "users", model: "User", select: "-password" },
      { path: "groupAdmin", model: "User", select: "-password" },
    ]);
    if (!added) {
      return res.status(httpStatus.NOT_FOUND).send(error);
    } else {
      res.status(httpStatus.OK).send(added);
    }
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
};
const removeFromGroup = async (req, res, next) => {
  const { chatId, userId } = req.body;
  try {
    const remove = await Chat.findByIdAndUpdate(
      { _id: chatId },
      { $pull: { users: userId } },
      { new: true }
    ).populate([
      { path: "users", model: "User", select: "-password" },
      { path: "groupAdmin", model: "User", select: "-password" },
    ]);
    if (!remove) {
      return res.status(httpStatus.NOT_FOUND).send(error);
    } else {
      res.status(httpStatus.OK).send(remove);
    }
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

module.exports = {
  fetchChat,
  accessChat,
  createChats,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
