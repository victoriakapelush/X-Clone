require("dotenv").config({ path: "./config.env" });
const mongoose = require('mongoose');
const mongoDB = process.env.mongoDB;
const { faker } = require('@faker-js/faker');
const User = require('./models/User');  
const Profile = require('./models/Profile');  
const Post = require('./models/Post');  

// Connect to MongoDB
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const generateFakeUserProfile = () => ({
    profileBio: faker.lorem.text(), // A short bio
    location: faker.location, // Random city name
    website: faker.internet.url, // Random URL for the website
    profilePicture: faker.image.avatar(), // Random avatar image
});

const generateFakeUser = (profileId) => ({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    profile: generateFakeUserProfile(), // Embeds the generated profile
  });

  const generateFakePost = (userId) => ({
    text: faker.lorem.text(),
    time: faker.date.past().toISOString(), // Random past date
    user: userId,                          // Reference to the user's ObjectId
  });

// Seed the database
const seedDatabase = async (numUsers = 10) => {
  
    const profiles = await Promise.all(
      Array.from({ length: numUsers }).map(async () => {
        const profileData = generateFakeUserProfile();
        const profile = new Profile(profileData);  // Create new Profile
        await profile.save();
        return profile;
      })
    );
  
    const users = await Promise.all(
      profiles.map(async (profile) => {
        const userData = generateFakeUser(profile._id);
        const user = new User(userData);  // Create new User
        await user.save();
        return user;
      })
    );
  
    await Promise.all(
      users.map(async (user) => {
        const posts = Array.from({ length: 5 }).map(() => generateFakePost(user._id)); // 5 posts per user
        await Post.insertMany(posts);
      })
    );
  
    console.log('Database seeded successfully');
    mongoose.disconnect();
  };
  
  // Start seeding
  seedDatabase().catch(err => {
    console.error("Seeding error: ", err);
    mongoose.disconnect();
  });