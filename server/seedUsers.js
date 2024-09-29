require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");
const mongoDB = process.env.mongoDB;
const { faker } = require("@faker-js/faker");
const User = require("./models/User");
const Profile = require("./models/Profile");
const Post = require("./models/Post");

// Connect to MongoDB
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const generateFakeUserProfile = () => ({
  profileBio: faker.person.bio(),
  location: faker.location.city(),
  website: faker.internet.url(),
  profilePicture: faker.image.avatar(),
  backgroundHeaderImage: faker.image.urlPicsumPhotos(),
});

const generateFakeUser = () => {
  const originalUsernameOrig = faker.person.fullName();
  const originalUsernameFormat = originalUsernameOrig
    .toLowerCase()
    .replace(/\s+/g, "");
  return {
    originalUsername: originalUsernameOrig,
    formattedUsername: `${originalUsernameFormat}`,
    email: faker.internet.email(),
    password: faker.internet.password(),
    profile: generateFakeUserProfile(),
  };
};

const generateFakePost = (userId) => ({
  text: faker.hacker.phrase(),
  time: faker.date.past().toISOString(),
  user: userId,
});

// Seed the database
const seedDatabase = async (numUsers = 10) => {
  try {
    // Create and save users with embedded profiles
    const users = await Promise.all(
      Array.from({ length: numUsers }).map(async () => {
        const userData = generateFakeUser(); // Generate user with embedded profile
        const user = new User(userData); // Create new User
        await user.save();
        return user;
      }),
    );

    await Promise.all(
      users.map(async (user) => {
        const posts = Array.from({ length: 5 }).map(() =>
          generateFakePost(user._id),
        ); // 5 posts per user
        await Post.insertMany(posts);
      }),
    );

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Seeding error: ", error);
  } finally {
    mongoose.disconnect();
  }
};

// Start seeding
seedDatabase().catch((err) => {
  console.error("Seeding error: ", err);
  mongoose.disconnect();
});
