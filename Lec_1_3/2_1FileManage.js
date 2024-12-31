const fs = require ('fs');

// fs.writeFile("2_1Dummy.txt", "Hi. This is an dummy file", function(err){ // create a new file & add data init
//   if(err) console.error(err.message));
//   else console.log("done");
// })


// fs.appendFile("2_1Dummy.txt", "\nI write this through appendFile ", function(err){  // to add more text
//   if(err) console.error(err.message));
//   else console.log("done");
// })


// fs.rename("2_1Dummy.txt", "2_1NewName.txt", (err) => {
//   if(err) console.error(err.message));
//   else console.log("done");
// })


// fs.copyFile("2_1NewName.txt", "2_1ToCopy.txt",  (err) => {
//   if(err) console.error(err.message);
//   else console.log("done");
// })


// fs.unlink("2_1ToCopy.txt", (err) => {   //to delete a file
//   if(err) console.error(err.message);
//   else console.log("Removed");
// })


// fs.rmdir("./RanFolder", (err) => {   //to delete empty folder
//   if(err) console.error(err.message);
//   else console.log("Removed");
// })   


fs.rm("./RanFolder", {recursive: true}, (err) => {   //to delete a folder
  if(err) console.error(err.message);
  else console.log("Removed");
})   