const mongoose = require("mongoose");
const Post = require("../models/Post");

const getTrendingTags = async (req, res) => {
  const loggedInUserId = new mongoose.Types.ObjectId(req.user.id);

  try {
    // Step 1: Aggregate tags from all posts except those by the logged-in user
    const tagsAggregation = await Post.aggregate([
      // Match posts that do not belong to the logged-in user
      { $match: { user: { $ne: loggedInUserId } } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", postCount: { $sum: 1 } } },
      { $sort: { postCount: -1 } },
      { $limit: 10 },
    ]);

    const trendingTags = tagsAggregation.map((tag) => ({
      tag: tag._id,
      postCount: tag.postCount,
    }));

    // Step 2: Fetch one random post for each trending tag
    const trendingTagsArray = trendingTags.map((tag) => tag.tag);
    const randomPostsPromises = trendingTagsArray.map((tag) => {
      return Post.aggregate([
        // Match posts that contain the current tag and are not by the logged-in user
        { $match: { tags: tag, user: { $ne: loggedInUserId } } }, // Ensure posts are not from the logged-in user
        { $sample: { size: 1 } },
      ]);
    });

    const randomPostsResults = await Promise.all(randomPostsPromises);

    // Step 3: Populate the user field in the random posts
    const populatedRandomPostsPromises = randomPostsResults.map((posts) => {
      if (posts.length > 0) {
        return Post.populate(posts, { path: "user" }); // Populate the user field
      }
      return [];
    });

    const populatedRandomPosts = await Promise.all(
      populatedRandomPostsPromises,
    );

    // Step 4: Prepare the response
    const response = trendingTags.map((tag, index) => ({
      tag: tag.tag,
      randomPost:
        populatedRandomPosts[index].length > 0
          ? populatedRandomPosts[index][0]
          : null,
      postCount: tag.postCount,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting trending tags and random posts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getTrendingTags };
