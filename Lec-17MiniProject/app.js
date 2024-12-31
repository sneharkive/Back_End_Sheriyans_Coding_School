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
      res.send("Account has been created!!");
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
      res.status(200).send("You can login");
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

app.get('/profile', isLoggedIn, (req, res) => {   //it is a protected route
  console.log(req.user);
  res.render("login");
})


app.listen(3000, () => console.log("Application has started!!!"));

