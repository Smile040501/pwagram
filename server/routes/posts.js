const express = require("express");

const postsController = require("../controllers/posts");
const fileUpload = require("../middleware/fileUpload");

const router = express.Router();

router.get("/", postsController.getPosts);

router.get("/:pId", postsController.getPostById);

router.post("/", fileUpload.single("image"), postsController.createPost);

module.exports = router;
