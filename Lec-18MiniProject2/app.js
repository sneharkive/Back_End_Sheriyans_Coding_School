const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');

const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const path = require('path');

app.set("view engine", "ejs" );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


app.get("/", (req, res) => {
  res.render("index");
});

app.post("/register", async (req, res) => {
  let {name, username, email, age, password} = req.body;

  let user = await userModel.findOne({email});  //user exist or not
  if(user) return res.status(500).send("User already registered");

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createdUser = await userModel.create({
        username,
        name,
        age,
        email,
        password: hash
      });

      let token = jwt.sign({email: createdUser.email, userId: createdUser._id}, "shhhh");
      res.cookie("token", token);
      res.redirect("/profile");
    })
  })
  
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  let {email, password} = req.body;

  let user = await userModel.findOne({email});
  if(!user) return res.status(500).send("Something went wrong!!!");

  bcrypt.compare(password, user.password, (err, result) => {
    if(result) {
      let token = jwt.sign({email: user.email, userId: user._id}, "shhhh");
      res.cookie("token", token);
      res.status(200).redirect("/profile");
    }
    else res.redirect("/login");
  })
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login")
});


//middleware
function isLoggedIn(req, res, next) { //check if logged in then cookie exist or not
  if(req.cookies.token === "") res.send('You need to be logged in!!!!');
  else{
    let data = jwt.verify(req.cookies.token, "shhhh");
    req.user = data;
    next();
  }
}

app.get('/profile', isLoggedIn, async (req, res) => {   //it is a protected route
  const userData = await userModel.findOne({email: req.user.email}).populate("posts");

  res.render("profile", {userData});
})

app.post('/post', isLoggedIn, async (req, res) => {   //it is a protected route
  const user = await userModel.findOne({email: req.user.email});
  const createdPost = await postModel.create({
    user: user._id,
    content: req.body.content
  });

  user.posts.push(createdPost._id);
  await user.save();
  // res.render("profile", {posts: user.posts});

  res.redirect("/profile");
})


app.get('/like/:id', isLoggedIn, async (req, res) => {   //it is a protected route
  const post = await postModel.findOne({_id: req.params.id}).populate("user");

  // console.log(req.user);
  
  if(post.likes.indexOf(req.user.userId) === -1) post.likes.push(req.user.userId);
  else post.likes.splice(post.likes.indexOf(req.user.userId), 1);

  await post.save();
  res.redirect("/feeds");
})

app.get('/edit/:id', isLoggedIn, async (req, res) => {   //it is a protected route
  const post = await postModel.findOne({_id: req.params.id}).populate("user");

  res.render("edit", {post});
})

app.post('/update/:id', isLoggedIn, async (req, res) => {  
  const updatePost = await postModel.findOneAndUpdate({_id: req.params.id}, {content: req.body.content}, {new: true});

  res.redirect("/profile");
})

app.get('/delete/:id', async (req, res) => {
  let deletedUser = await postModel.findOneAndDelete({_id: req.params.id})
  res.redirect("/profile");
})

app.get('/deleteacc/:id', async (req, res) => {
  // let deletedUser = await userModel.findOneAndDelete({_id: req.params.id})
  let deletedUser = await userModel.findOne({_id: req.params.id});

  deletedUser.posts.forEach(async (post) => {
    let postData = await postModel.findOneAndDelete({_id: post})
  })
  
  await userModel.findOneAndDelete(deletedUser);

  res.redirect("/");
})



app.get('/feeds', isLoggedIn, async (req, res) => {
  let allPost = await postModel.find(); 
  let user = await userModel.findOne({_id: req.user.userId})
  
  // console.log(user);

  res.render("feeds", {posts: allPost, user});
})



/* <a class="mt-2 text-blue-800 font-bold bg-white hover:bg-yellow-200 px-2 rounded-3xl" href="/like/<%= post._id %>"> <%= post.likes.indexOf(userData._id) ? "Like" : "Unlike" %>
            </a> */


app.listen(3000, () => console.log("Application has started!!!"));
