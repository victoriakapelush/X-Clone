const List = require("../../models/List");
const User = require("../../models/User");
const Post = require("../../models/Post");

const addUserToList = async (req, res) => {
  const { userId, listId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // Initialize the member count if not present
    list.membersCount = list.membersCount || 0;

    // Check if the user is already in the list
    const userIndexInList = list.members.indexOf(userId);
    const listIndexInUser = user.lists.indexOf(listId);

    if (userIndexInList === -1) {
      // If user is not in the list, add them and increase the count
      list.members.push(userId);
      user.lists.push(listId);
      list.membersCount += 1; // Increase the count

      // Fetch all posts from the user and add them to the list's posts
      const userPosts = await Post.find({ user: userId });
      list.posts.push(...userPosts.map((post) => post._id)); // Add the post IDs

      await list.save();
      await user.save();
      return res.status(200).json({ message: "User added to the list", list });
    } else {
      // If user is already in the list, remove them and decrease the count
      list.members.splice(userIndexInList, 1);
      user.lists.splice(listIndexInUser, 1);
      list.membersCount = Math.max(0, list.membersCount - 1); // Decrease the count but ensure it never goes below 0

      // Remove the user's posts from the list's posts
      const userPosts = await Post.find({ user: userId });
      list.posts = list.posts.filter(
        (postId) =>
          !userPosts.some((post) => String(post._id) === String(postId)),
      );

      await list.save();
      await user.save();
      return res
        .status(200)
        .json({ message: "User removed from the list", list });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addUserToList };
