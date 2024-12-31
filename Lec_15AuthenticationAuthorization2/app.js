const express = require('express');
const app = express();
const userModel = require("./models/user");

const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


app.set("view engine", "ejs" );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


app.get('/', (req, res) => {
  res.render("index");
})

app.post('/create', (req, res) => {
  let{username, email, password, age} = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createdUser = await userModel.create({
        username,
        email,
        password: hash,
        age
      })

      let token = jwt.sign({email}, "shhhhhhhhhh");
      res.cookie("token", token);
      res.send(createdUser);
    })
  })
})

app.get("/login", (req, res) => {
  res.render("login");
})

app.post("/login", async (req, res) => {
  let user = await userModel.findOne({email:req.body.email});
  if(!user) return res.send("Something is wrong!!!");  //there is no user with the given email id

  //here user.password is "hash" password
  bcrypt.compare(req.body.password, user.password, (err, result) => {
        if(result){
          let token = jwt.sign({email: user.email}, "shhhhhhhhhh");
          res.cookie("token", token);
          res.send("Yes.. You are logged in!!");
        } 
        else res.send("Something is wrong!!!");
      })
});



app.get('/logout', (req, res) => {
  res.cookie("token","");  //remove token
  res.redirect("/");
})

app.listen(3000, () => console.log("Application has started!!!"));




// app.get("/", (req, res) => {  // cookie
//   res.cookie("name", "sneha");  //set cookie
//   res.send("Done");
// })



// app.get("/", (req, res) => {  // bcrypt  => encryption
//   //general format    (// here salt is an random string)
//   // bcrypt.genSalt(saltRounds, (err, salt) => {   
//   //   bcrypt.hash(myPlainTextPassword, salt, (err, hash) => {  // here salt is an random string
//   //     //Store hash in your password DB
//   //   })
//   // })


//   bcrypt.genSalt(10, (err, salt) => {  
//     bcrypt.hash("MyPassword", salt, (err, hash) => {
//       console.log(hash);  //encrypted password
//     })
//   })
// })


//here we get value of hash is =>
  // $2b$10$KH/RCD8Z3oLjH8KKLKonLee5hlU4ymEZhibkJWUbZ.rkUTFPUgMhu


// app.get("/", (req, res) => { //bcrypt  => decryption
//   // bcrypt.compare(password, hash, (err, result) => {
//   //   // result == true
//   // })

//   bcrypt.compare("MyPassword", "$2b$10$KH/RCD8Z3oLjH8KKLKonLee5hlU4ymEZhibkJWUbZ.rkUTFPUgMhu", (err, result) => {
//     console.log(result);
//   })

//   res.send("Hey"); 
// })




// app.get("/", (req, res) => {  // cookie
//   let token = jwt.sign({email: "sneha@gmail.com"}, "secret" );
//   res.cookie("token", token);
//   res.send("done")
//   // console.log(token);
// })