const express = require('express');
const app = express();
const path = require('path')

//parsers for form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));


//install ejs from npm   =>  npm i ejs
//setup ejs as a view engine
app.set('view engine', 'ejs')



app.get("/", (req, res) => {
  res.render("index");
})

app.get("/profile/:username", (req, res) => {  //dynamic routing
  res.send(`Hey,  ${req.params.username.toUpperCase()}`);
})

app.get("/author/:username/:age", (req, res) => {  //dynamic routing
  res.send(req.params);
  // res.send(`Hey,  ${req.params.username.toUpperCase()}. You age is ${req.params.age}`);
})

app.listen(3000, () => {
  console.log("Application has started !!");
})

