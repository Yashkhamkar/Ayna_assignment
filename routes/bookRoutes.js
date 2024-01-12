const express = require("express");

const { protect } = require("../middlewares/authMiddleware");
const {
  createBook,
  likeBook,
  unlikeBook,
  getBooksByLikes,
} = require("../controller/bookController");

const router = express.Router();
router.route("/").post(protect, createBook);
router.route("/:id/like").put(protect, likeBook);
router.route("/:id/unlike").put(protect, unlikeBook);
router.route("/allbooks").get(protect, getBooksByLikes);
module.exports = router;
