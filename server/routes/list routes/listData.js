const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  getListData, deleteList, updateList 
} = require("../../controllers/list controllers/getListData");
const { verifyJWT } = require("../../controllers/loginController");

router.get("/:listId", verifyJWT, getListData);
router.delete("/:listId", verifyJWT, deleteList);
router.put("/:listId", verifyJWT, upload.single("image"), updateList);

module.exports = router;
