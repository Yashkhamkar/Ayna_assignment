const express = require("express");
const {
  registerUser,
  authUser,
  getAuthors,
  getOneAuthor,
  getAuthorProfile,
} = require("../controller/authorController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();
router.route("/").post(registerUser);
router.route("/login").post(authUser);
router.route("/allauthors").get(protect, getAuthors);
router.route("/oneauthor/:id").get(protect, getOneAuthor);
router.route("/myprofile").get(protect, getAuthorProfile);
module.exports = router;
