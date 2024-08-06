const Post = require('../models/Post');
const User = require('../models/User');

const getAllMedia = async (req, res) => {
  const username = req.params.formattedUsername;

  try {
    const user = await User.findOne({ formattedUsername: username });
        if (!user) {
            return res.status(404).send('User not found');
        }

    const mediaPosts = await Post.find({
        user: user,
        $or: [
          { image: { $exists: true, $ne: null } }
        ]
      }).select('image');
  
      res.status(200).json({ success: true, mediaPosts: mediaPosts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  module.exports = { getAllMedia };