const Post = require('../models/Post');

const getTrendingTags = async (req, res) => {
    const loggedInUserId = req.user.id; 

    try {
        // Step 1: Aggregate tags from all posts except those by the logged-in user
        const tagsAggregation = await Post.aggregate([
            // Match posts that do not belong to the logged-in user
            { $match: { user: { $ne: loggedInUserId } } },
            // Unwind tags array to get individual tags
            { $unwind: "$tags" },
            // Group by tag and count occurrences
            { $group: { _id: "$tags", postCount: { $sum: 1 } } },
            // Sort by count in descending order
            { $sort: { count: -1 } },
            // Limit to top 3 tags
            { $limit: 10 }
        ]);

        // Prepare the list of trending tags
        const trendingTags = tagsAggregation.map(tag => ({
            tag: tag._id,
            postCount: tag.postCount
        }));

        // Step 2: Fetch one random post for each trending tag
        const trendingTagsArray = trendingTags.map(tag => tag.tag);
        const randomPostsPromises = trendingTagsArray.map(tag => {
            return Post.aggregate([
                // Match posts that contain the current tag and are not by the logged-in user
                { $match: { tags: tag, user: { $ne: loggedInUserId } } },
                // Randomly pick one post
                { $sample: { size: 1 } }
            ]);
        });

        // Wait for all random posts queries to complete
        const randomPostsResults = await Promise.all(randomPostsPromises);

        // Prepare the response with one random post for each trending tag
        const response = trendingTags.map((tag, index) => ({
            tag: tag.tag,
            randomPost: randomPostsResults[index].length > 0 ? randomPostsResults[index][0] : null,
            postCount: tag.postCount
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error('Error getting trending tags and random posts:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getTrendingTags };




