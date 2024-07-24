const mongoose = require('mongoose');
const User = require('../models/User');

const saveFollowingCount = async (req, res) => {
    const currentUser = req.user.id;
    const otherUserId = req.body._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(currentUser).session(session);
        const otherUser = await User.findById(otherUserId).session(session);

        if (!user || !otherUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).send({ message: 'Users not found' });
        }

        // Ensure the arrays are initialized
        user.profile.totalFollowing = Array.isArray(user.profile.totalFollowing) ? user.profile.totalFollowing : [];
        otherUser.profile.totalFollowers = Array.isArray(otherUser.profile.totalFollowers) ? otherUser.profile.totalFollowers : [];

        // Check if the user has already followed the other user
        const userIndex = otherUser.profile.totalFollowers.indexOf(currentUser);
        const userIndex2 = user.profile.totalFollowing.indexOf(otherUserId);

        if (userIndex === -1 && userIndex2 === -1) {
            // User has not followed the other user yet, so add their ID to the followers array
            otherUser.profile.totalFollowers.push(currentUser);
            user.profile.totalFollowing.push(otherUserId);
        } else if (userIndex !== -1 && userIndex2 !== -1) {
            // User already followed the other user, so remove their ID from the followers array
            otherUser.profile.totalFollowers.splice(userIndex, 1);
            user.profile.totalFollowing.splice(userIndex2, 1);
        } else {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).send({ message: 'Inconsistent follow state' });
        }

        // Recalculate counts based on the lengths of the arrays
        otherUser.profile.followers = otherUser.profile.totalFollowers.length;
        user.profile.following = user.profile.totalFollowing.length;

        await user.save({ session });
        await otherUser.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).send({ message: 'Following and followers status updated successfully', user, otherUser });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error saving following count:', error);
        res.status(500).send({ message: 'Error saving following count', error: error.message });
    }
};

module.exports = { saveFollowingCount };

