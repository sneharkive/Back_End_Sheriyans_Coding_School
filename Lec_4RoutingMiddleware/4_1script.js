const express = require('express')
const app = express()

//create middleware

app.use((req, res, next) => {
  console.log("First Middleware");
  next();
})

app.use((req, res, next) => {
  console.log("Second Middleware");
  next();
})

// create routes

app.get('/', (req, res) => {
  res.send("Hello World")
})

app.get('/about', (req, res, next) => {
  // res.send("This is Sneha Roy")
  return next(new Error("Not implemented"))   //to handle error
});

//Error Handler  => it should write at the end

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Broke!");
})

app.listen(3000);




