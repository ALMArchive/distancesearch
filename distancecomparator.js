"use strict"

const is          = require("is");
const strSim      = require('string-similarity');
const levenshtein = require('js-levenshtein');
const nameParse   = require('humanparser');
const Regex       = require("regex");

const Privates    = Symbol("Privates");
const ClassSymbol = Symbol("DistanceComparator");

class DistanceComparator {
   constructor(comp, split) {
      this.Privates = {};
      this.ClassSymbol = ClassSymbol;

      // Validate Comparator
      if(is.string(comp)) {
         // If string, turn into a regex
         comp = new Regex(comp, "g");
         this.Privates.comp = (val) => (comp.test(val)) ? 1 : 0;
      } else if(is.regexp(comp)) {
         // If regex turn into a function that returns binary distance on matches
         comp = new Regex(comp, "g");
         this.Privates.comp = (val) => (comp.test(val)) ? 1 : 0;
      } else if(is.object(comp)) {
         // If object, check for mutually exclusive dice or leven properies
         if(comp.dice) {
            this.Privates.comp = (val) => (strSim.compareTwoStrings(val, comp.dice.val));
         } else if(comp.leven) {
            this.Privates.comp = (val) => (levenshtein(val, comp.leven.val));
         }
      } else {
         // If function, trust it and add it to our Private variable.
         this.Privates.comp = comp;
      }

      // Validate Split
      if(!!split) {
         if(is.string(split)) {
            // If string, turn into a regex
            let reg = new RegExp(split+"", "g");
            split = (val) => val.split(reg);
            this.Privates.split = split;
         } else if(is.regexp(split)) {
            // If regex turn into a function that returns binary distance on matches
            split = new RegExp(split, "g");
            split = (val) => val.split(split);
            this.Privates.split = split;
         } else if(is.object(split)) {
            // If object, check for mutually exclusive dice or leven properies
            if(split.human === true) {
               split = (val) => Object.values(nameParse.parseName(val));
               this.Privates.split = split;
            }
         } else if(is.fn(split)) {
            // If function, trust it and add it to our Private variable.
            this.Privates.split = split;
         }
      }
   }

   static get symbol() {
      return ClassSymbol;
   }

   static isClass(obj) {
      if(!is.object(obj)) return false;
      return (obj.ClassSymbol === ClassSymbol);
   }

   isClass(obj) {
      if(!is.object(obj)) return false;
      return (obj.ClassSymbol === ClassSymbol);
   }

   get symbol() {
      return ClassSymbol;
   }

   comp(val, minOrMax) {
      let trim = (str) => str.replace(/\s{2,}/g," ").trim();
      if(is.string(val)) val = trim(val); // trim extra spaces

      if(this.Privates.split) {
         val = this.Privates.split(val);
      }
      if(is.array(val)) {
         let comps = val.map((elem) => this.Privates.comp(elem));
         if(minOrMax && minOrMax === "min") {
            return comps.reduce((a,c) => (a > c) ? c : a)
         } else {
            return comps.reduce((a,c) => (a < c) ? c : a);
         }
      } else {
         let out = this.Privates.comp(val);
         return out;
      }
   }
}

module.exports = DistanceComparator;
