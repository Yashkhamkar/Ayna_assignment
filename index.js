const express = require("express");
const connectDB = require("./utils/db");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const port = process.env.PORT;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const authorRoutes = require("./routes/authorRoutes");
const bookRoutes = require("./routes/bookRoutes");
app.use("/api/authors", authorRoutes);
app.use("/api/books", bookRoutes);
