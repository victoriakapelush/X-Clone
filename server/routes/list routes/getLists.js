const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  getLists,
  addList,
} = require("../../controllers/list controllers/getListsController");
const { verifyJWT } = require("../../controllers/loginController");

router.get("/:formattedUsername", verifyJWT, getLists);

router.post("/", verifyJWT, upload.single("image"), addList);

module.exports = router;
