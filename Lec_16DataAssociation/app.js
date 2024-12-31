const express = require('express');
const app = express();

const userModel = require("./models/user");
const postModel = require("./models/post");


app.get('/', (req, res) => {
  res.send("Working!!!");
});

app.get('/create', async (req, res) => {
  let createdUser = await userModel.create({
    username: "Sneha Roy", 
    email: "sneha@gmail.com", 
    age: 22
  });
  res.send(createdUser);
});

app.get('/post/create', async (req, res) => {
  let post = await postModel.create({
    postdata: "Hi , Hello everyone!!", 
    user: "676c4e2a77215f408460f6a7"

  })

  let user = await userModel.findOne({_id: "676c4e2a77215f408460f6a7"});
  user.posts.push(post._id);
  await user.save();

  res.send({post, user});
});

app.listen(3000, () => console.log("Application has started!!!"));