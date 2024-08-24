const Post = require("../models/Post");

const saveLikeCount = async (req, res) => {
  const { _id } = req.body;
  const currentUser = req.user.id;

  try {
    // Find the post being liked or unliked
    const post = await Post.findById(_id);

    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    if (typeof post.likeCount !== "number") {
      post.likeCount = 0;
    }

    // Check if the user has already liked the post
    const userIndex = post.likes.indexOf(currentUser);

    if (userIndex === -1) {
      // User has not liked the post yet, so add their ID to the likes array and increment likeCount
      post.likes.push(currentUser);
      post.likeCount += 1;
    } else {
      // User already liked the post, so remove their ID from the likes array and decrement likeCount
      post.likes.splice(userIndex, 1);
      post.likeCount = Math.max(post.likeCount - 1, 0); // Ensure likeCount does not go below 0
    }

    // Save the updated post
    const updatedPost = await post.save();

// If the post is a repost, update the original post's like count
if (post && post.originalPostId) {
  // Fetch the original post using the originalPostId
  const originalPost = await Post.findById(post.originalPostId._id);
  if (originalPost) {
    const originalUserIndex = originalPost.likes.indexOf(currentUser);

    if (userIndex === -1 && originalUserIndex === -1) {
      // User has liked the repost but not the original post
      originalPost.likes.push(currentUser);
      originalPost.likeCount += 1;
    } else if (userIndex !== -1 && originalUserIndex !== -1) {
      // User has liked both the repost and the original post
      originalPost.likes.splice(originalUserIndex, 1);
      originalPost.likeCount = Math.max(originalPost.likeCount - 1, 0);
    }

    // Save the updated original post
    await originalPost.save();
  }
}


    res.status(200).send({
      message: "Like status updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error saving like count:", error);
    res.status(500).send({
      message: "Error saving like count",
      error: error.message,
    });
  }
};

module.exports = { saveLikeCount };


