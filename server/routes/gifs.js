const express = require("express");
const router = express.Router();
const giphyController = require("../controllers/gifsController");

router.get("/search", giphyController.searchGifs);
router.get("/random", giphyController.randomGifs);

module.exports = router;
