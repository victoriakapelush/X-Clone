const Post = require('../models/Post');

const saveLikeCount = async (req, res) => {
    const { likeCount, _id } = req.body;

    try {
        const result = await Post.findByIdAndUpdate(
            _id, 
            { $set: { like: likeCount } }, 
            { new: true } 
        );
        if (!result) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const userIndex = result.likes.indexOf(userId);

        if (userIndex === -1) {
            // User has not liked the post yet, so add their ID to the likes array
            result.likes.push(userId);
        } else {
            // User already liked the post, so remove their ID from the likes array
            result.likes.splice(userIndex, 1);
        }

        const updatedPost = await result.save();

        res.status(200).send({ message: 'Like status updated successfully', post: updatedPost });
      } catch (error) {
        console.error('Error saving like count:', error);
        res.status(500).send({ message: 'Error saving like count', error: error.message });
    }
};

module.exports = { saveLikeCount };

  