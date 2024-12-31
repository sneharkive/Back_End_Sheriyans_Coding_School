const express = require('express');
const app = express();

const userModel = require('./usermodel');

app.get('/', (req, res) => {
  res.send("Hey")
})

app.get('/create', async (req, res) => {
  let createdUser = await userModel.create({    //asynchronous code
    name: "sneha",
    username: "roy",
    email:"sneha@gmail.com"
  })

  // let createdUser = await userModel.create({    //asynchronous code
  //   name: "Kakashi Hatake",
  //   username: "hatake",
  //   email:"hatake@gmail.com"
  // })

  res.send(createdUser);
})

app.get('/read', async (req, res) => {
  let users = await userModel.find()  // to read all the users
  res.send(users);

  // let user = await userModel.find({username: "roy"})  // to read given user
  // res.send(user);

  let userOne = await userModel.findOne({username: "roy"})  // to read given user
  res.send(userOne);
})

app.get('/update', async (req, res) => {
  let updatedUser = await userModel.findOneAndUpdate({username: "roy"}, {name: "Sneha Roy"}, {new: true})
  res.send(updatedUser);
})

app.get('/delete', async (req, res) => {
  let deletedUser = await userModel.findOneAndDelete({username: "hatake"})
  // res.send(deletedUser)
  res.send(`${deletedUser.name} is deleted`);
})


app.listen(3000, () => {
  console.log("Application has started!!");
})