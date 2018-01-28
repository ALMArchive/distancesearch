"use strict"

import is from "is";
import strSim from "string-similarity";
import levenshtein from "js-levenshtein";
import nameParse from "humanparser";
import regex from "regex";

const CLASS_SYMBOL = Symbol("DistanceComparator Symbol");

export default class DistanceComparator {
   constructor(comp, split) {
      this[CLASS_SYMBOL] = {
        CLASS_SYMBOL
      };

      // Validate Comparator
      if(is.string(comp)) {
         // If string, turn into a regex
         comp = new regex(comp, "g");
         this[CLASS_SYMBOL].comp = (val) => (comp.test(val)) ? 1 : 0;
      } else if(is.regexp(comp)) {
         // If regex turn into a function that returns binary distance on matches
         comp = new regex(comp, "g");
         this[CLASS_SYMBOL].comp = (val) => (comp.test(val)) ? 1 : 0;
      } else if(is.object(comp)) {
         // If object, check for mutually exclusive dice or leven properies
         if(comp.dice) {
            this[CLASS_SYMBOL].comp = (val) => (strSim.compareTwoStrings(val, comp.dice.val));
         } else if(comp.leven) {
            this[CLASS_SYMBOL].comp = (val) => (levenshtein(val, comp.leven.val));
         }
      } else {
         // If function, trust it and add it to our Private variable.
         this[CLASS_SYMBOL].comp = comp;
      }

      // Validate Split
      if(!!split) {
         if(is.string(split)) {
            // If string, turn into a regex
            let reg = new RegExp(split+"", "g");
            split = (val) => val.split(reg);
            this[CLASS_SYMBOL].split = split;
         } else if(is.regexp(split)) {
            // If regex turn into a function that returns binary distance on matches
            split = new RegExp(split, "g");
            split = (val) => val.split(split);
            this[CLASS_SYMBOL].split = split;
         } else if(is.object(split)) {
            // If object, check for mutually exclusive dice or leven properies
            if(split.human === true) {
               split = (val) => Object.values(nameParse.parseName(val));
               this[CLASS_SYMBOL].split = split;
            }
         } else if(is.fn(split)) {
            // If function, trust it and add it to our Private variable.
            this[CLASS_SYMBOL].split = split;
         }
      }
   }

   static get symbol() {
      return CLASS_SYMBOL;
   }

   isClass(obj) {
     if(!is.object(obj)) return false;
     if (!obj[CLASS_SYMBOL]) return false;
     if (!this[CLASS_SYMBOL]) return false;
     return (obj[CLASS_SYMBOL].CLASS_SYMBOL === this[CLASS_SYMBOL].CLASS_SYMBOL);
   }

   get symbol() {
     return this[CLASS_SYMBOL].CLASS_SYMBOL;
   }

   comp(val, minOrMax) {
      let trim = (str) => str.replace(/\s{2,}/g," ").trim();
      if(is.string(val)) val = trim(val); // trim extra spaces

      if(this[CLASS_SYMBOL].split) {
         val = this[CLASS_SYMBOL].split(val);
      }
      if(is.array(val)) {
         let comps = val.map((elem) => this[CLASS_SYMBOL].comp(elem));
         if(minOrMax && minOrMax === "min") {
            return comps.reduce((a,c) => (a > c) ? c : a)
         } else {
            return comps.reduce((a,c) => (a < c) ? c : a);
         }
      } else {
         let out = this[CLASS_SYMBOL].comp(val);
         return out;
      }
   }
}
