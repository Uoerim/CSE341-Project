import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Community from "../models/Community.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding...");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const postTitles = [
  "Just finished my first full-stack project!",
  "TIL about an amazing JavaScript feature",
  "Looking for feedback on my portfolio",
  "This made my day - random act of kindness",
  "Unpopular opinion: Tabs > Spaces",
  "My cat just did the funniest thing",
  "Found this gem while cleaning my room",
  "Can anyone explain async/await?",
  "Rate my setup - finally done!",
  "Why is my code not working?",
  "This view from my morning hike",
  "Made a game in 48 hours for a hackathon",
  "Switching careers to tech at 35",
  "The sunset today was incredible",
  "My side project just hit 1k users!",
  "Coffee addiction level: Expert",
  "Finally understood recursion today",
  "This bug took me 6 hours to find",
  "Just got my first dev job offer!",
  "Built a weather app with React",
  "My dog vs the vacuum cleaner",
  "Best pizza I've ever had",
  "Started learning Python yesterday",
  "This is why I love coding",
  "Productive day at the home office",
  "My plant collection is getting out of hand",
  "Just deployed my first app to production",
  "Why do I keep buying programming books?",
  "Finally fixed that merge conflict",
  "My sourdough starter is alive!",
  "Learned Docker the hard way today",
  "This meme perfectly describes my life",
  "Beach day with the family",
  "Git saved my life today",
  "My workspace tour - minimalist setup",
  "Just passed my AWS certification!",
  "Why is CSS so hard sometimes?",
  "Found a typo in production... again",
  "My first open source contribution",
  "Cooking experiments: Success edition",
  "Array methods finally make sense",
  "This error message is poetry",
  "My journey from zero to developer",
  "Weekend project turned into passion",
  "The best debugging tool: console.log",
  "My code worked on the first try!",
  "Rain sounds while coding = perfect",
  "Just refactored 1000 lines of code",
  "My keyboard collection is growing",
  "This Stack Overflow answer saved me",
  "Learning TypeScript - worth it?",
  "My plant finally bloomed!",
  "Code review feedback: Constructive edition",
  "The sunset from my balcony tonight",
  "Just finished reading Clean Code",
  "My dev environment setup guide",
  "Coffee shop coding session",
  "This visualization of sorting algorithms",
  "My cat is my rubber duck",
  "Just learned about design patterns"
];

// Dummy image URLs from Unsplash for variety
const dummyImages = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085", // Coding setup
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6", // Code screen
  "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b", // Laptop workspace
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97", // Coffee and laptop
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4", // Mountain landscape
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05", // Nature scene
  "https://images.unsplash.com/photo-1574169208507-84376144848b", // Abstract tech
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4", // Code editor
  "https://images.unsplash.com/photo-1510906594845-bc082582c8cc", // Workspace top view
  "https://images.unsplash.com/photo-1518770660439-4636190af475", // Technology
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e", // Forest path
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd", // Developer working
  "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb", // Minimal setup
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29", // Sunset
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7", // Tech desk
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713", // Programming
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d", // Laptop on desk
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40", // Office space
  "https://images.unsplash.com/photo-1511376777868-611b54f68947", // Beach sunset
  "https://images.unsplash.com/photo-1517433456452-f9633a875f6f", // Data visualization
];

const postContents = [
  "I can't believe how much I've learned in the past few months. Here's what I built...",
  "Did you know you can do this? It completely changed how I write code.",
  "Spent two weeks on this. Would love your honest thoughts and suggestions.",
  "Was having a terrible day until this happened. Faith in humanity restored!",
  "I know this will be controversial, but hear me out on why tabs are superior...",
  "Caught this on camera. Never laughed so hard in my life 😂",
  "Blast from the past! Can't believe I used to have this...",
  "I've read the docs multiple times but still confused. Help a newbie out?",
  "After months of collecting parts and tweaking, it's finally complete!",
  "I've tried everything and nothing seems to work. Here's my code...",
  "Started at 6am, totally worth it for this view.",
  "Barely slept but we made something cool. Check it out!",
  "Nervous but excited. Any advice for a career changer?",
  "No filter needed. Nature is the best artist.",
  "Sharing some stats and lessons learned from building this.",
  "How many cups is too many? Asking for a friend...",
  "That moment when everything just clicks. Best feeling ever!",
  "It was a semicolon. A SEMICOLON. I need a vacation.",
  "Dreams do come true! Starting next month. So grateful!",
  "Following a tutorial but added my own twist. Thoughts?",
  "The eternal battle continues. My money's on the dog.",
  "New place opened downtown. Highly recommend!",
  "Coming from JavaScript, this is interesting so far.",
  "Moments like these remind me why I chose this path.",
  "Clean desk, clear mind. Here's my current setup.",
  "Running out of space but I can't stop buying them.",
  "All the late nights paid off. It's live and working!",
  "My bookshelf is 90% programming books I haven't finished.",
  "Git stash saved my bacon. Never doing that again.",
  "It has a name now. No turning back from this hobby.",
  "Should've used it from the start. Lesson learned.",
  "I feel personally attacked by this one 😅",
  "Perfect weather, perfect company, perfect day.",
  "Lost 3 hours of work, ran git reflog, got it all back. Magic.",
  "Less is more. Everything I need and nothing I don't.",
  "Months of studying paid off! On to the next challenge.",
  "No matter how long I've been coding, it still gets me sometimes.",
  "How does this keep happening? Pushed to main... again.",
  "Small PR but feels like a big milestone for me!",
  "Sometimes they work out, sometimes... they don't. This one worked!",
  "Map, filter, reduce - the holy trinity finally clicked.",
  "How can an error be so confusing yet so accurate?",
  "Self-taught and finally making it happen. You can too!",
  "Built this for fun, now considering making it a product.",
  "Works every time. Don't @ me.",
  "No tests failed, no errors, no warnings. Is this real life?",
  "Nothing beats this combo for deep work sessions.",
  "My IDE is so much faster now. Definitely worth the weekend.",
  "Currently at 3 mechanical keyboards. Send help.",
  "Forever grateful to the person who wrote this 8 years ago.",
  "Making the switch. Heard good things, ready to learn!",
  "After 6 months of nothing, we have flowers! So proud.",
  "Actually helpful comments for once. Love this team.",
  "Mother nature showing off again. Lucky to see this.",
  "Great book! Definitely changed how I approach coding.",
  "Written guide to my entire workflow. Hope it helps someone!",
  "Found a new spot with great wifi and even better coffee.",
  "Watched this for 20 minutes straight. So satisfying.",
  "Best debugging partner. Never judges my code.",
  "Factory pattern is blowing my mind right now."
];

const communities = [
  "webdev", "programming", "javascript", "python", "learnprogramming",
  "reactjs", "nodejs", "cats", "dogs", "food", "nature", "technology",
  "career", "productivity", "coffee", "gaming", "books", "fitness"
];

const dummyUsernames = [
  "codewizard", "techguru", "devninja", "pixelpusher", "bytebender",
  "scriptkitty", "debugduck", "asyncawait", "reactqueen", "nodemaster",
  "pythonista", "jsgeek", "fullstacker", "codeartist", "hackerman",
  "syntaxsage", "looplegend", "gitgod", "terminalking", "shellshock"
];

const seedData = async () => {
  try {
    await connectDB();

    // Get existing users
    let users = await User.find().limit(10);
    
    // Create dummy users if we don't have enough
    if (users.length < 10) {
      console.log(`Only ${users.length} users found. Creating dummy users...`);
      
      const usersToCreate = [];
      for (let i = users.length; i < Math.min(20, dummyUsernames.length); i++) {
        const hashedPassword = await bcrypt.hash("dummypass123", 10);
        usersToCreate.push({
          username: dummyUsernames[i],
          email: `${dummyUsernames[i]}@example.com`,
          password: hashedPassword,
          gender: i % 3 === 0 ? "female" : i % 3 === 1 ? "male" : "prefer not to say",
          bio: "Just a dummy account for testing",
        });
      }
      
      const createdUsers = await User.insertMany(usersToCreate);
      console.log(`Created ${createdUsers.length} dummy users`);
      
      // Fetch all users again
      users = await User.find().limit(20);
    }
    
    // Get communities
    const existingCommunities = await Community.find();

    if (users.length === 0) {
      console.log("No users found. Please create some users first.");
      process.exit(1);
    }

    console.log(`Found ${users.length} users and ${existingCommunities.length} communities`);

    // Create posts with varying engagement levels
    const posts = [];
    const now = Date.now();

    for (let i = 0; i < postTitles.length; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomCommunity = existingCommunities.length > 0 
        ? existingCommunities[Math.floor(Math.random() * existingCommunities.length)]
        : null;

      // Vary the age of posts (from 1 hour to 30 days ago)
      const ageVariations = [
        1 * 60 * 60 * 1000,      // 1 hour
        3 * 60 * 60 * 1000,      // 3 hours
        6 * 60 * 60 * 1000,      // 6 hours
        12 * 60 * 60 * 1000,     // 12 hours
        24 * 60 * 60 * 1000,     // 1 day
        2 * 24 * 60 * 60 * 1000, // 2 days
        3 * 24 * 60 * 60 * 1000, // 3 days
        5 * 24 * 60 * 60 * 1000, // 5 days
        7 * 24 * 60 * 60 * 1000, // 1 week
        14 * 24 * 60 * 60 * 1000, // 2 weeks
        30 * 24 * 60 * 60 * 1000  // 1 month
      ];

      const ageOffset = ageVariations[Math.floor(Math.random() * ageVariations.length)];
      const postDate = new Date(now - ageOffset);

      // Create varied engagement patterns
      let upvoteCount, downvoteCount, commentCount;
      
      // 20% are "hot" posts (recent with high engagement)
      if (i % 5 === 0 && ageOffset < 24 * 60 * 60 * 1000) {
        upvoteCount = Math.floor(Math.random() * 500) + 200;
        downvoteCount = Math.floor(Math.random() * 50);
        commentCount = Math.floor(Math.random() * 100) + 20;
      }
      // 20% are "rising" posts (very recent with growing engagement)
      else if (i % 5 === 1 && ageOffset < 12 * 60 * 60 * 1000) {
        upvoteCount = Math.floor(Math.random() * 150) + 50;
        downvoteCount = Math.floor(Math.random() * 20);
        commentCount = Math.floor(Math.random() * 30) + 10;
      }
      // 20% are "top" posts (high total upvotes)
      else if (i % 5 === 2) {
        upvoteCount = Math.floor(Math.random() * 1000) + 500;
        downvoteCount = Math.floor(Math.random() * 100);
        commentCount = Math.floor(Math.random() * 200) + 50;
      }
      // 20% are moderate posts
      else if (i % 5 === 3) {
        upvoteCount = Math.floor(Math.random() * 100) + 20;
        downvoteCount = Math.floor(Math.random() * 30);
        commentCount = Math.floor(Math.random() * 20);
      }
      // 20% are low engagement posts
      else {
        upvoteCount = Math.floor(Math.random() * 20) + 1;
        downvoteCount = Math.floor(Math.random() * 10);
        commentCount = Math.floor(Math.random() * 5);
      }

      // Generate fake user IDs for upvotes/downvotes (using existing users cyclically)
      const upvoteUsers = [];
      const downvoteUsers = [];
      
      for (let j = 0; j < upvoteCount; j++) {
        upvoteUsers.push(users[j % users.length]._id);
      }
      
      for (let j = 0; j < downvoteCount; j++) {
        downvoteUsers.push(users[j % users.length]._id);
      }

      // Add image to content (70% of posts have images)
      const hasImage = Math.random() < 0.7;
      const imageUrl = hasImage ? dummyImages[i % dummyImages.length] : null;
      const contentWithImage = imageUrl 
        ? `${postContents[i]}<br><br><img src="${imageUrl}?w=800&q=80" alt="Post image" />`
        : postContents[i];

      const post = {
        title: postTitles[i],
        content: contentWithImage,
        author: randomUser._id,
        community: randomCommunity ? randomCommunity._id : null,
        upvotes: upvoteUsers,
        downvotes: downvoteUsers,
        comments: [], // In real scenario, this would be populated with actual comment IDs
        status: "published",
        createdAt: postDate,
        updatedAt: postDate
      };

      posts.push(post);
    }

    // Delete existing seed posts (optional - comment out if you want to keep existing data)
    await Post.deleteMany({});
    console.log("Cleared existing posts");

    // Insert new posts
    const createdPosts = await Post.insertMany(posts);
    console.log(`Successfully created ${createdPosts.length} posts!`);

    // Show some statistics
    const recentPosts = createdPosts.filter(p => 
      (now - new Date(p.createdAt).getTime()) < 24 * 60 * 60 * 1000
    );
    const highEngagement = createdPosts.filter(p => p.upvotes.length > 200);
    
    console.log("\nStatistics:");
    console.log(`- Posts from last 24 hours: ${recentPosts.length}`);
    console.log(`- High engagement posts (>200 upvotes): ${highEngagement.length}`);
    console.log(`- Average upvotes: ${Math.floor(createdPosts.reduce((sum, p) => sum + p.upvotes.length, 0) / createdPosts.length)}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
