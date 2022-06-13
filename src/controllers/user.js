const httpStatus = require("http-status");
const generateToken = require("../config/generateToken");
const User = require("../models/user");

const registerUser = async (req, res, next) => {
  const { name, email, password, pic } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(httpStatus.BAD_REQUEST).send("user already register");
    }
    const body = {
      name,
      email,
      password,
      pic,
    };
    const create = new User(body);
    await create
      .save()
      .then((data) => {
        res.status(httpStatus.CREATED).send({
          _id: data?._id,
          name: data?.name,
          email: data?.email,
          pic: data?.pic,
          token: generateToken(data?._id),
        });
      })
      .catch((error) => {
        return res.status(httpStatus.BAD_REQUEST).send(error);
      });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).send("user not found");
    }
    if (user && (await user.matchPassword(password))) {
      res.status(httpStatus.OK).send({
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        pic: user?.pic,
        token: generateToken(user?._id),
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).send("Invalid Email or Password");
    }
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

const allUser = async (req, res, next) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.status(httpStatus.OK).send(users);
};

module.exports = {
  registerUser,
  loginUser,
  allUser,
};
