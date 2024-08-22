const natural = require("natural");
const path = require("path");
const User = require("../models/User");
const Post = require("../models/Post");
const { format } = require("date-fns");

// Initialize the classifier
let classifier = new natural.BayesClassifier();

// Training data
const trainingData = [
  { text: "The new Marvel movie is amazing.", tags: ["entertainment"] },
  { text: "Tesla stocks are soaring.", tags: ["business"] },
  {
    text: "New study shows the benefits of a Mediterranean diet.",
    tags: ["health"],
  },
  { text: "Check out my new recipe for a vegan lasagna.", tags: ["lifestyle"] },
  { text: "NASA discovered a new exoplanet.", tags: ["science"] },
  {
    text: "Why don’t scientists trust atoms? Because they make up everything!",
    tags: ["humor"],
  },
  {
    text: "Breaking news: Earthquake in California.",
    tags: ["current events"],
  },
  {
    text: "A man walks into a library and asks the librarian for a book on Pavlov's dogs and Schrodinger's cat. The librarian responds, \"It rings a bell, but I'm not sure if it's here or not.\"",
    tags: ["humor"],
  },
  { text: "A funny story about a dog.", tags: ["humor"] },
  { text: "Here is a hilarious joke.", tags: ["humor"] },
  { text: "An amazing concert by a famous band.", tags: ["entertainment"] },
  { text: "Tips for starting a small business.", tags: ["business"] },
  { text: "How to stay healthy during the winter.", tags: ["health"] },
  { text: "Fashion trends for the summer.", tags: ["lifestyle"] },
  { text: "A breakthrough in cancer research.", tags: ["science"] },
  { text: "Global warming is a serious issue.", tags: ["current events"] },
  {
    text: "Ever wondered why cows have hooves instead of feet? Because they lactose! If you need a good laugh, check out our collection of the funniest animal jokes.",
    tags: ["humor"],
  },
  {
    text: "Just heard a great joke: Why did the math book look sad? Because it had too many problems. If you need a mood boost, make sure to follow our account for daily doses of humor and light-hearted fun.",
    tags: ["humor"],
  },
  {
    text: "Why don’t skeletons fight each other? They don’t have the guts. If you’re a fan of puns and good laughs, follow us for your daily dose of humor and clever jokes!",
    tags: ["humor"],
  },
  {
    text: "I told my wife she was drawing her eyebrows too high. She looked surprised. Stick around for more funny anecdotes and witty humor—guaranteed to make you smile!",
    tags: ["humor"],
  },
  {
    text: "I used to play piano by ear, but now I use my hands. Follow us for daily jokes and funny stories that’ll brighten up your day and give you a good laugh!",
    tags: ["humor"],
  },
  {
    text: "Why did the scarecrow win an award? Because he was outstanding in his field! For more hilarious jokes and funny content, make sure to keep up with our posts!",
    tags: ["humor"],
  },
  {
    text: "Parallel lines have so much in common. It’s a shame they’ll never meet. Stay tuned for more clever humor and entertaining jokes to keep you laughing throughout the day!",
    tags: ["humor"],
  },
];

// Add training data to the classifier
const trainClassifier = () => {
  trainingData.forEach((item) => {
    item.tags.forEach((tag) => {
      classifier.addDocument(item.text, tag);
    });
  });

  // Train the classifier
  classifier.train();

  // Save the trained classifier
  classifier.save(path.join(__dirname, "classifier.json"), (err) => {
    if (err) {
      console.error("Error saving classifier:", err);
    } else {
      console.log("Classifier trained and saved.");
    }
  });
};

// Load classifier
const loadClassifier = (callback) => {
  natural.BayesClassifier.load(
    path.join(__dirname, "classifier.json"),
    null,
    (err, loadedClassifier) => {
      if (err) {
        if (err.code === "ENOENT") {
          console.log("Classifier file not found, creating a new one.");
          // Initialize a new classifier if file is not found
          classifier = new natural.BayesClassifier();
          callback(classifier);
        } else {
          console.error("Error loading classifier:", err);
        }
      } else {
        classifier = loadedClassifier;
        callback(classifier);
      }
    },
  );
};

// Get top tags from classifier
const getTopThreeHighestValues = (text) => {
  if (!classifier) {
    console.error("Classifier is not loaded.");
    return [];
  }

  const classifications = classifier.getClassifications(text);
  console.log("Classifications:", classifications);

  if (!classifications || classifications.length === 0) {
    console.error("No classifications found.");
    return [];
  }

  // Sort classifications by value in descending order
  const sortedClassifications = classifications.sort(
    (a, b) => b.value - a.value,
  );

  // Get the top 3 unique values
  const topThree = [];
  const seenValues = new Set();

  for (const classification of sortedClassifications) {
    if (topThree.length >= 3) break;
    if (!seenValues.has(classification.value)) {
      topThree.push(classification.label);
      seenValues.add(classification.value);
    }
  }
  return topThree;
};

const getPost = async (req, res) => {
  const currentUser = req.params.formattedUsername;
  try {
    const user = await User.findOne({ formattedUsername: currentUser });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const posts = await Post.find({ user: user._id })
      .sort({ time: -1 })
      .populate("user")
      .populate("repostedFrom")
      .populate({
        path: 'totalReplies.user', 
        model: 'User' 
    });
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addPost = async (req, res) => {
  const { text, gif } = req.body;
  const currentUser = req.user.originalUsername;

  try {
    let filename = null;
    if (req.file) {
      filename = req.file.filename;
    }

    const user = await User.findOne({ originalUsername: currentUser });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const postDate = new Date();
    const formattedTime = format(postDate, "PPpp");

    // Load classifier and classify the post
    loadClassifier((classifier) => {
      if (!classifier) {
        return res.status(500).json({ message: "Classifier not initialized" });
      }

      const topTags = getTopThreeHighestValues(text);

      const newPost = new Post({
        text,
        image: filename,
        gif,
        time: formattedTime,
        reply: 0,
        totalReplies: [],
        repost: 0,
        likeCount: 0,
        likes: [],
        share: 0,
        user: user._id,
        tags: topTags,
      });

      newPost
        .save()
        .then(() => {
          user.profile.posts = (user.profile.posts || 0) + 1;

          // Retrain the classifier with the new post
          topTags.forEach((tag) => {
            classifier.addDocument(text, tag);
          });
          classifier.train();

          // Save the updated classifier
          classifier.save(path.join(__dirname, "classifier.json"), (err) => {
            if (err) {
              console.error("Error saving classifier:", err);
            }
          });

          return user.save();
        })
        .then(() => {
          res
            .status(201)
            .json({ message: "Post added successfully", post: newPost });
        })
        .catch((error) => {
          res
            .status(500)
            .json({ message: "Server error", error: error.message });
        });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deletePost = async (req, res) => {
  const { postId } = req.body;
  const currentUserId = req.user.id;

  try {
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(currentUserId);

    // Ensure posts count doesn't go below zero
    if (user.profile.posts > 0) {
      user.profile.posts = user.profile.posts - 1;
    } else {
      user.profile.posts = 0;
    }

    await user.save();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


trainClassifier();

module.exports = { getPost, addPost, deletePost };
