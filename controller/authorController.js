const asyncHandler = require("express-async-handler");
const { generateToken } = require("../utils/generateToken");
const User = require("../models/authorModel");
const Book = require("../models/bookModel");
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, pass, phone } = req.body;

  const userExists = await User.findOne({ email });
  const userExists1 = await User.findOne({ phone });

  if (userExists && userExists1) {
    return res.status(404).json("User already exists");
  }

  const user = await User.create({
    name,
    email,
    pass,
    phone,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phone: user.phone,
      token: generateToken(user._id),
    });
  }
});
const authUser = asyncHandler(async (req, res) => {
  const { email, pass } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(pass))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json("Invalid email or password");
  }
});
const getAuthors = asyncHandler(async (req, res) => {
  const authorsWithBooksCount = await User.aggregate([
    {
      $lookup: {
        from: "books",
        localField: "_id",
        foreignField: "author",
        as: "books",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        isAdmin: 1,
        phone: 1,
        bookCount: { $size: "$books" },
      },
    },
  ]);

  res.json(authorsWithBooksCount);
});
const getOneAuthor = asyncHandler(async (req, res) => {
  const authorId = req.params.id;
  const author = await User.findById(authorId);

  if (!author) {
    res.status(404).json({ error: "Author not found" });
    return;
  }
  const books = await Book.find({ author: author._id });
  res.json({
    author: {
      _id: author._id,
      name: author.name,
      email: author.email,
      isAdmin: author.isAdmin,
      phone: author.phone,
    },
    books: books,
  });
});
const getAuthorProfile = asyncHandler(async (req, res) => {
  const authorId = req.user._id;
  const author = await User.findById(authorId);
  if (!author) {
    res.status(404).json({ error: "Author not found" });
    return;
  }
  const books = await Book.find({ author: author._id });
  res.json({
    author: {
      _id: author._id,
      name: author.name,
      email: author.email,
      isAdmin: author.isAdmin,
      phone: author.phone,
    },
    books: books,
  });
});

module.exports = { registerUser, authUser, getAuthors, getOneAuthor,getAuthorProfile };
