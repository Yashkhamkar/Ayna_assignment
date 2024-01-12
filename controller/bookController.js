const asyncHandler = require("express-async-handler");
const Book = require("../models/bookModel");
const User = require("../models/authorModel");

const createBook = asyncHandler(async (req, res) => {
  const { title, likes } = req.body;
  const authorId = req.user._id;
  const author = await User.findById(authorId);
  if (!author) {
    res.status(404).json({ error: "Author not found" });
    return;
  }
  const book = await Book.create({
    title,
    likes,
    author: authorId,
  });

  if (book) {
    res.status(201).json({
      _id: book._id,
      title: book.title,
      likes: book.likes,
      author: {
        _id: author._id,
        name: author.name,
        email: author.email,
        isAdmin: author.isAdmin,
        phone: author.phone,
      },
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    });
  } else {
    res.status(500).json({ error: "Error creating the book" });
  }
});
const likeBook = asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const userId = req.user._id;
  const book = await Book.findById(bookId);

  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return;
  }
  if (book.likesBy.includes(userId)) {
    res.status(400).json({ error: "You have already liked this book" });
    return;
  }

  book.likes += 1;
  book.likesBy.push(userId);
  await book.save();

  res.status(200).json({
    _id: book._id,
    title: book.title,
    likes: book.likes,
    author: book.author,
  });
});
const unlikeBook = asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const userId = req.user._id; // Assuming the user ID is available from authentication middleware

  // Find the book by ID
  const book = await Book.findById(bookId);

  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return;
  }

  // Check if the user has already liked the book
  const userLikedIndex = book.likesBy.indexOf(userId);

  if (userLikedIndex !== -1) {
    // User has already liked the book, unlike it
    book.likes -= 1;
    book.likesBy.splice(userLikedIndex, 1); // Remove the user from likesBy array
    await book.save();

    res.status(200).json({
      _id: book._id,
      title: book.title,
      likes: book.likes,
      author: book.author, // Include other book details as needed
    });
  } else {
    res.status(400).json({ error: "You have not liked this book" });
  }
});

const getBooksByLikes = asyncHandler(async (req, res) => {
  try {
    const books = await Book.find({})
      .sort({ likes: -1 }) // Sort in descending order based on likes
      .populate("author", "_id name email isAdmin phone")
      .exec();

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: "Error fetching books" });
  }
});
module.exports = { createBook, likeBook, unlikeBook, getBooksByLikes };
