const List = require("../../models/List");
const User = require("../../models/User");

const addUserToList = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.lists.push(user);

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addUserToList };
