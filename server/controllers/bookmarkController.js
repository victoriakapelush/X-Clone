const express = require('express');
const router = express.Router();
const User = require('../models/User');

const addBookmark = async (req, res) => {
  const { postId } = req.body;
  const currentUser = req.user.id;

  try {
    if (!postId) {
      throw new Error('Post ID is required');
    }

    const user = await User.findById(currentUser);
    if (!user) {
      throw new Error('User not found');
    }

    console.log('User bookmarks before update:', user.bookmarks);  

    const bookmarkIndex = user.bookmarks.indexOf(postId);

    if (bookmarkIndex === -1) {
      // If the post is not bookmarked, add it
      user.bookmarks.push(postId);
      await user.save();
      res.status(200).json({ message: 'Bookmark added' });
    } else {
      // If the post is already bookmarked, remove it
      user.bookmarks.splice(bookmarkIndex, 1);
      await user.save();
      res.status(200).json({ message: 'Bookmark removed' });
    }

    console.log('User bookmarks after update:', user.bookmarks);  

  } catch (error) {
    console.error('Error in addBookmark:', error);  
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
