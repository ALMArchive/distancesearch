"use strict";

const DistanceComparator = require("../distancecomparator.js");

// First parameter must be views or no-views
// views are access data for how many times the artists were searche for
let celeb1 = new DistanceComparator("views");
let celeb2 = new DistanceComparator("no-views", "all");

// The second parameter must be a string for the data set you want to load
// all loads all the data columns
let celeb3 = new DistanceComparator("views","all");

// If a specific data column is passed in it will attempt to load that instead
let celeb4 = new DistanceComparator("views","all");
