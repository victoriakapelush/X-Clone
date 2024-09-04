const List = require("../../models/List");

const getListData = async (req, res) => {
  const { listId } = req.params;

  try {
    const list = await List.findById(listId)
      .populate("owner")
      .populate("posts")
      .populate("members");

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getListData };
