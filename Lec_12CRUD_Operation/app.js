const express = require('express');
const app = express();
const path = require('path');
const userModel = require('./models/user');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render("index")
})


app.post('/create', async (req, res) => {
  let {name, email, image} = req.body;
  let createdUser = await userModel.create({
    name, email, image

    //this above line means =>
    // name: name,
    // email: email,
    // image: image
  })
  res.redirect(`/oneuser?email=${email}`);
})

app.get('/oneuser', async (req, res) => {
  let user = await userModel.findOne({email: req.query.email});
  res.render("oneuser", {user: user})
})

app.get('/read', async (req, res) => {
  let allUsers = await userModel.find();
  res.render("read", {users: allUsers})
})

app.get('/delete/:id', async (req, res) => {
  let deletedUser = await userModel.findOneAndDelete({_id: req.params.id})
  res.redirect("/read")
})

app.get('/edit/:id', async (req, res) => {
  const data =  await userModel.findOne({_id: req.params.id});
  res.render('edit', {data})
})

app.post('/update/:id', async (req, res) => {
  let doc = req.body;
  const document =  await userModel.findOne({_id: req.params.id});
  let updateFields = {};
  if (doc.name) updateFields.name = doc.name;
  if (doc.email) updateFields.email = doc.email;
  if (doc.image) updateFields.image = doc.image;
  
  let updatedUser = await userModel.findOneAndUpdate({_id: req.params.id},updateFields , {new: true})
  res.render("oneuser", {user: updatedUser})
})




app.listen(3000, () => {
  console.log("Application has started!!");
})


