const User = require('../models/User');

const saveLikeCount = async (req, res) => {
    const { likeCount } = req.body;
    console.log(likeCount);
    const currentUser = req.user.originalUsername;
  
    try {
        const result = await User.findOneAndUpdate(
            { originalUsername: currentUser }, 
            { $set: { count: count } },
            { new: true, upsert: true } 
          );
        console.log(result);
  
      res.status(200).send({ message: 'Like count saved successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Error saving like count', error });
    }
  };
  
  module.exports = { saveLikeCount };
  