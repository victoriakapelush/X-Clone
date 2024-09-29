const List = require("../../models/List");
const User = require("../../models/User");

const getListData = async (req, res) => {
  const { listId } = req.params;

  try {
    const list = await List.findById(listId)
      .populate("owner")
      .populate({
        path: "posts",
        populate: [{ path: "user" }, { path: "totalReplies" }],
      })
      .populate("members");

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteList = async (req, res) => {
  const { listId } = req.params;
  const userId = req.user.id;

  try {
    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const user = await User.findById(userId);
    if (user) {
      user.lists = user.lists.filter((id) => id.toString() !== listId);
      await user.save();
    }

    await list.deleteOne();

    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateList = async (req, res) => {
  const { listId } = req.params;
  const { name, description } = req.body;
  const userId = req.user.id;

  try {
    let list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    if (req.file) {
      list.image = req.file.filename;
    }

    list.name = name || list.name;
    list.description = description || list.description;

    await list.save();

    // Update the list in the user's lists array
    const user = await User.findById(userId);

    if (user) {
      const listIndex = user.lists.findIndex(
        (l) => l._id.toString() === listId,
      );
      if (listIndex > -1) {
        user.lists[listIndex].name = list.name;
        user.lists[listIndex].description = list.description;
        user.lists[listIndex].image = list.image;
      }

      await user.save();
    }

    res.status(200).json({ message: "List updated successfully", list });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getListData, deleteList, updateList };
