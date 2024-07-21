const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');

const addBookmark = async (req, res) => {
  const { postId } = req.body;
  const currentUser = req.user.id;

  try {

    if (!postId) {
      throw new Error('Post ID is required');
    }

    const user = await User.findById(currentUser);
    const post = await Post.findById(postId);

    if (!user) {
      throw new Error('User not found');
    }
    
    const userBookmarkIndex = user.bookmarks.indexOf(postId);
    const postBookmarkIndex = post.bookmarks.indexOf(currentUser);

    if (userBookmarkIndex === -1 && postBookmarkIndex === -1) {
      // If the post is not bookmarked by the user, add it
      user.bookmarks.push(postId);
      post.bookmarks.push(currentUser);
      await user.save();
      await post.save();
      res.status(200).json({ message: 'Bookmark added' });
    } else if (userBookmarkIndex !== -1 && postBookmarkIndex !== -1) {
      // If the post is already bookmarked by the user, remove it
      user.bookmarks.splice(userBookmarkIndex, 1);
      post.bookmarks.splice(postBookmarkIndex, 1);
      await user.save();
      await post.save();
      res.status(200).json({ message: 'Bookmark removed' });
    } else {
      throw new Error('Inconsistent bookmark state');
    }

    console.log('User bookmarks after update:', user.bookmarks);  
    console.log('Post bookmarks after update:', post.bookmarks);  

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

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getBookmark, addBookmark };
