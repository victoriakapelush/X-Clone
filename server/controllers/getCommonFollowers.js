const User = require('../models/User');

const getCommonFollowers = async (req, res) => {
  const currentUserId = req.user.id;
  const targetUsername = req.params.formattedUsername;

  try {
    // Get the current user's followings
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    const currentUserFollowings = currentUser.profile.totalFollowing.map(user => user._id);

    // Get the target user and their followers
    const targetUser = await User.findOne({ formattedUsername: targetUsername });
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    const targetUserFollowers = targetUser.profile.totalFollowers.map(user => user._id);

    // Create a Set from targetUserFollowers for faster look-up
    const targetFollowersSet = new Set(targetUserFollowers.map(id => id.toString()));

    // Use filter to find common followers
    const commonFollowers = currentUserFollowings.filter(followingId => targetFollowersSet.has(followingId.toString()));

    // Randomly select two common followers
    const randomCommonFollowers = [];
    if (commonFollowers.length > 0) {
      // Shuffle the array and get two random common followers
      const shuffledFollowers = commonFollowers.sort(() => 0.5 - Math.random());
      randomCommonFollowers.push(...shuffledFollowers.slice(0, 2));
    }

    // Find user details for the selected random common followers and populate their profiles
    const randomCommonFollowerDetails = await User.find({ _id: { $in: randomCommonFollowers } })
      .populate('profile.totalFollowing') 
      .populate('profile.totalFollowers');

    // Return the results
    return res.status(200).json({ commonFollowers: randomCommonFollowerDetails });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getCommonFollowers };


