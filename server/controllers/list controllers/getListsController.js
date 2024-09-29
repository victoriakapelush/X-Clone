const User = require("../../models/User");
const List = require("../../models/List");

const getLists = async (req, res) => {
  const currentUserId = req.user.id;

  try {
    const user = await User.findById(currentUserId).populate({
      path: "lists",
      populate: [
        { path: "owner", model: "User" },
        { path: "members", model: "User" },
        { path: "posts", model: "Post" },
      ],
      options: { sort: { createdAt: -1 } }, // Sort by creation date in descending order
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ lists: user.lists });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new List
const addList = async (req, res) => {
  const currentUserId = req.user.id;
  const { name, description } = req.body;
  try {
    const user = await User.findById(currentUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let filename = null;
    if (req.file) {
      filename = req.file.filename;
    }

    const newList = new List({
      name,
      description,
      image: filename,
      owner: user._id,
      members: [],
      posts: [],
    });

    const savedList = await newList.save();
    user.lists.push(savedList._id);
    await user.save();

    res.status(200).json({ savedList });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getLists, addList };
