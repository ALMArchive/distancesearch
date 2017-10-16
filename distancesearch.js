"use strict"

const DistanceComparator = require("./distancecomparator.js");
const Privates = Symbol("Privates");
const is = require("is");
const ClassSymbol = Symbol("DistanceSearch");

/********** API VERY LIKELY TO CHANGE IN FUTURE   *************/
/********** WILL MOST LIKELY REMOVE COMPARATOR
            FROM CONSTRUCTION AND MOVE IT TO FIND *************/

class DistanceSearch {
   constructor(conObj) {
      this.Privates = {};
      this.ClassSymbol = ClassSymbol;
      this.Privates.data = conObj.data;
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

   swapComparator(comp) {
      return new DistanceSearch({
         data:       this.Privates.data,
         comparator: this.Privates.comparator
      });
   }

   find(qOpts, comp) {
      return this.findN(qOpts, comp, 1)[0];
   }

   findN(qOpts, comp, n) {
      n = parseInt(n);

      let extVal;
      if(qOpts.minOrMax === "max") {
         extVal = Number.MIN_SAFE_INTEGER;
      } if(qOpts.minOrMax === "min") {
         extVal = Number.MAX_SAFE_INTEGER;
      }
      let out = [];
      let tmpComp;
      let compType = (qOpts.minOrMax === "max") ? (() => tmpComp >= extVal)
                                            : (() => tmpComp <= extVal);

      /******** CAN CLEAN THIS UP USING A PRIORITY QUEUE
      ///
      //////
      //////////
      */

      // For Every row of data
      for(const obj of this.Privates.data) {
         // For every search column
         for(const sq of qOpts.search) {
            tmpComp = comp.comp(obj[sq], qOpts.minOrMax);
            // computing mins or maxs based on qOpts.minOrMax and comp set above
            if(compType()) {
               extVal = tmpComp;
               let tmpObj = {};
               for(const pullProp of qOpts.ret) {
                  if(qOpts.ret.length === 1 && pullProp === "*") {
                     for(const tmpProp of Reflect.ownKeys(obj)) {
                        tmpObj[tmpProp] = obj[tmpProp];
                     }
                  } else {
                     tmpObj[pullProp] = obj[pullProp];
                  }
               }
               out.unshift({pri: extVal, data: tmpObj});
               if(out.length > n) {
                  out.pop();
               }
               out
            }
         }
      }
      return out;
   }
}

module.exports = DistanceSearch;
