const User = require('../models/User');

const saveFollowingCount = async (req, res) => {
    const { _id } = req.body;
    const currentUser = req.user.id;

    try {
        const user = await User.findById(currentUser);
        const otherUser = await User.findById(_id);

        if (!user || !otherUser) {
            return res.status(404).send({ message: 'Users not found' });
        }

        user.profile.following = typeof user.profile.following === 'number' ? user.profile.following : 0;
        otherUser.profile.followers = typeof otherUser.profile.followers === 'number' ? otherUser.profile.followers : 0;        

        // Check if the user has already followed the user
        const userIndex = otherUser.profile.totalFollowers.indexOf(currentUser);

        if (userIndex === -1) {
            // User has not followed the user yet, so add their ID to the followers array and increment followers
            otherUser.profile.totalFollowers.push(currentUser);
            otherUser.profile.followers += 1;
            user.profile.following += 1;
            user.profile.totalFollowing.push(_id);
        } else {
            // User already followed the other one, so remove their ID from the followers array and decrement followers
            otherUser.profile.totalFollowers.splice(userIndex, 1);
            otherUser.profile.followers = Math.max(otherUser.profile.followers - 1, 0); // Ensure follower does not go below 0
            user.profile.totalFollowing.splice(_id, 1);
            user.profile.following = Math.max(user.profile.following - 1, 0); // Ensure follower does not go below 0
        }

        const updatedUser = await user.save();
        const updatedOtherUser = await otherUser.save();

        res.status(200).send({ message: 'Following and followers status updated successfully', user: updatedUser, otherUser: updatedOtherUser });
    } catch (error) {
        console.error('Error saving following count:', error);
        res.status(500).send({ message: 'Error saving following count', error: error.message });
    }
};

module.exports = { saveFollowingCount };