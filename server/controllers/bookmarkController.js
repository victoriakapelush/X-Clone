const express = require('express');
const router = express.Router();
const User = require('../models/User');

const addBookmark = async (req, res) => {
    const { postId } = req.body;
    const currentUser = req.user.id;
  
    try {
      const user = await User.findById(currentUser);
      if (user.bookmarks.includes(postId)) {
        // If the post is already bookmarked, remove it
        user.bookmarks = user.bookmarks.filter(bookmark => bookmark.toString() !== postId);
        await user.save();
        res.status(200).json({ message: 'Bookmark removed' });
      } else {
        // If the post is not bookmarked, add it
        user.bookmarks.push(postId);
        await user.save();
        res.status(200).json({ message: 'Bookmark added' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

const getBookmark = async (req, res) => {
    const currentUser = req.user.id;

   try {
    const user = await User.findById(currentUser).populate({
      path: 'bookmarks',
      populate: {
          path: 'user', 
          model: 'User' 
      }
  })
  .exec();

    if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getBookmark, addBookmark };
