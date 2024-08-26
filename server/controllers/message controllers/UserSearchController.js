const User = require('../../models/User');

const searchUsers = async (req, res) => {
  try {
    let query = req.query.q || "";
    const loggedInUserId = req.user.id;

    // Escape special characters
    query = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const minQueryLength = 2; // Minimum length for query
    if (query.length < minQueryLength) {
      return res.json([]); // Return empty array for short queries
    }

    // Perform search
    const users = await User.find({
      _id: { $ne: loggedInUserId },
      $or: [
        { originalUsername: { $regex: `^${query}`, $options: 'i' } },
        { formattedUsername: { $regex: `^${query}`, $options: 'i' } },
        { 'profile.updatedName': { $regex: `^${query}`, $options: 'i' } }
      ]
    });

    res.json(users);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ message: 'Error searching users', error: error.message });
  }
};

module.exports = { searchUsers };
