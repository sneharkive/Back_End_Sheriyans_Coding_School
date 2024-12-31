const express = require ('express');
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');


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




app.get("/", (req, res) => {  // cookie
  let token = jwt.sign({email: "sneha@gmail.com"}, "secret" );
  res.cookie("token", token);
  res.send("done")
  // console.log(token);
})


app.get("/read", (req, res) => {
  // console.log(req.cookies.token);
  let data = jwt.verify(req.cookies.token, "secret");
  console.log((data));
})



app.listen(3000, () => console.log("Application has started!!!"))




// After authentication => you perform a task => then server forget who you are so you need to perform authentication again and again after each task

// to solve this problem we use => COOKIES and SESSION

//Required Packages => 
// npm init -y 
// npm i express   
// npm i jsonwebtoken bcrypt
//npm i cookie-parser

