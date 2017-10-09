"use strict";

const Celebs = require("../celebs.js");

// Creating a new Celebs returns a promise wrapping the data set
let celeb = new Celebs("views","all");

console.log(celeb.constructor.name === "Promise"); // true

// You can process the data using then and passing a function
celeb.then((elem) => console.log(elem)); // 11241 items
