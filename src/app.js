const express = require("express");
const fs = require("fs");
const cors = require("cors");

const mongoose = require("mongoose");

const app = express();

const { type } = require("os");

app.use(cors());

const PORT = 5000;

// connection string
const mongodbURI = "mongodb://localhost:27017/lec";
mongoose.connect(mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    location: String,
    job_type: String,
    pay_rate_per_hr_dollar: Number,
    skills: [{ type: String }],
    liked_by: [{ type: String }],
    viewed_by: [{ type: String }],
    id: Number,
    user_id: Number,
    post_by_username: String,
    post_by_fullname: String,
    post_date: String,
    comments: [{ type: String }],
  }
);

const Post = mongoose.model("posts", postSchema);

Post.createCollection()
  .then((col) => {
    console.log("Collection", col , "Created");
  })
  .catch((err) => {
    console.log(err);
  });

// Post.insertMany(
//   [{
//     title: "PHP Developer Required",
//     description: "For a client project PHP Developer is required",
//     location: "Butwal",
//     job_type: "Full Time",
//     pay_rate_per_hr_dollar: 45.0,
//     skills: ["PHP", "JS", "HTML"],
//     liked_by: ["test111", "test1", "test123"],
//     viewed_by: ["test111", "test1", "test123"],
//     id: 2,
//     user_id: 1,
//     post_by_username: "user1",
//     post_by_fullname: "Mathew Hayden",
//     post_date: "2023-06-10T09:24:07.659034",
//     comments: [],
//   },
//   {
//     title: "Python Developer Required",
//     description: "For a client project Python Developer is required",
//     location: "Lalitpur",
//     job_type: "Full Time",
//     pay_rate_per_hr_dollar: 35.0,
//     skills: ["Python", "JS", "Java"],
//     liked_by: ["test111", "test1", "test123"],
//     viewed_by: ["test111", "test1", "test123"],
//     id: 3,
//     user_id: 2,
//     post_by_username: "user2",
//     post_by_fullname: "Emma Watson",
//     post_date: "2023-06-10T21:51:10.643105",
//     comments: [],
//   },
//   {
//     title: "JS Developer Required",
//     description: "For a client project JS Developer is required",
//     location: "Kathmandu",
//     job_type: "Part Time",
//     pay_rate_per_hr_dollar: 15.0,
//     skills: ["Wordpress", "JS", "HTML"],
//     liked_by: ["test111", "test1", "test123"],
//     viewed_by: ["test111", "test1", "test123"],
//     id: 4,
//     user_id: 3,
//     post_by_username: "user3",
//     post_by_fullname: "Sunny Baniya",
//     post_date: "2023-06-10T21:53:40.698655",
//     comments: [],
//   },
// ]).then(() => {
//   console.log("Posts created");
// });

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  fullname: String,
  title: String,
  add_title: String,
  skills: [{ type: String }],
  address: String,
  job_type: String,
  id: Number,
  is_active: Boolean,
  followers: [{ type: String }],
  followings: [{ type: String }],
});

const User = mongoose.model("user", userSchema);

// User.createCollection()
//   .then((col) => {
//     console.log("Collection", col, "Created");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// local host: http://localhost:5000
app.get("/", (req, resp) => {
  resp.status(200).send({ status: "OK", message: "App is running" });
});

// read file and send content of file as response
app.get("/api/v1/posts", (req, resp) => {
  // const posts = await Post.findById({id: 2,id: 3,id: 4});
  const posts = fs.readFileSync("./data/posts.json", "utf-8").toString();
  resp.status(200).send(posts);
});

// read file and send userdata as response
app.get("/api/v1/user", async (req, resp) => {
  // const user = fs.readFileSync("./data/user.json", "utf-8").toString();
  const user = await User.find({id: 1});
  resp.status(200).send(user[0]);
});

app.post("/api/v1/user", async (req, resp) => {
  const lastUser = await User.findOne({}, null, { sort: { id: -1 } });

  let id = 1;
  if (lastUser) {
    id = lastUser.id + 1;
  }
  const newUser = {
    email: "testuser@test.com",
    username: "user1",
    fullname: "Royal Shrestha",
    title: "Software Developer",
    add_title: "Graphic Designer",
    skills: ["JS", "Python", "JAVA"],
    address: "Kathmandu, Nepal",
    job_type: "Full Time",
    id: id,
    is_active: true,
    followers: [],
    followings: [],
  };
  User.create(newUser).then((createdUser) => {
    console.log("User Created");
    resp.status(200).send(createdUser);
  });
});

app.listen(PORT, () => {
  console.log("App is running on port " + PORT);
});
