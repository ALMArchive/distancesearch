"use strict"

const DistanceSearch     = require("../distancesearch.js");
const DistanceComparator = require("../distancecomparator.js");
const chai               = require("chai");
const is                 = require("is");
const celebData          = require("../node_modules/celebs/data/json/no-views/pantheon.json");

const passIns = ["",1,()=>{},[],{},null,undefined,Symbol("")];


describe("DistanceSearch", function() {
   describe("Construction", function() {
      describe("Parameter validation: valid", function() {
         it("Should return DistanceSearch when passed correct inputs.", function() {
            let dc = new DistanceComparator("Word");
            let ds = new DistanceSearch({data:[{}],comparator:dc});
            chai.expect(ds.constructor.name === "DistanceSearch").to.be.true;
         });
         it("Should throw error when passed incorrect inputs.", function() {
            passIns.filter((e) => !is.array(e)).map((e1) =>
               passIns.map((e2) =>
                  chai.expect(() =>
                     new DistanceSearch({data:e1, comparator:e2})).to.throw(Error)));
         });
         it("Perfect data with perfect flag should return DistanceSearch.", function() {
            let dc = new DistanceComparator("Word");
            let tmpDat = [{data:1,food:"asd",dog:{}},{data:1,food:"ad",dog:{}},{data:2,food:"sd",dog:{}}];
            let ds = new DistanceSearch({data: tmpDat,comparator:dc, perfect: true});
            chai.expect(ds.constructor.name === "DistanceSearch").to.be.true;
         });
      });
   });
   describe("swapComparator", function() {
      describe("Input Validation", function() {
         it("Should throw error on non DistanceComparator inputs", function() {
            passIns.map((e) =>
               chai.expect(function() {
                  let dc = new DistanceComparator("Word");
                  let ds = new DistanceSearch({data:[{}],comparator:dc});
                  ds.swapComparator(e);
               }).to.throw(Error));
         });
      });
      describe("Output Validation", function() {
         it("Should return DistanceSearch on correct inputs", function() {
            passIns.map((e) =>
               chai.expect((() => {
                  let dc = new DistanceComparator("Word");
                  let ds = new DistanceSearch({data:[{}],comparator:dc});
                  return DistanceSearch.isClass(ds.swapComparator(dc));
               })()).to.be.true);
         });
      });
   });
   describe("find", function() {
      describe("Input Validation", function() {
         it("Should throw error on invalid input", function() {
            let dc = new DistanceComparator("Word");
            let ds = new DistanceSearch({data:[{}],comparator:dc});
            chai.expect(() => ds.findClosest()).to.throw(Error);
            passIns.filter((e) => !is.object(e)).map((e) => {
               chai.expect(() => ds.find("", e)).to.throw(Error);
            });

            let testProps1 = ["search","ret","minOrMax",null];
            testProps1.map((e1) =>
               testProps1.map((e2) =>
                  testProps1.map((e3) =>
                     passIns.map((e4) =>
                        passIns.map((e5) =>
                           passIns.map((e6) => {
                              let obj = {[e1]: e4, [e2]: e5, [e3]: e6};
                              chai.expect(() => ds.find("", obj))
               }))))));
         });

      });
      describe("findN", function() {
         describe("Input Validation", function() {
            it("Should throw error on invalid input", function() {
               let dc = new DistanceComparator("Word");
               let ds = new DistanceSearch({data:[{}],comparator:dc});
               chai.expect(() => ds.findClosest()).to.throw(Error);
               passIns.filter((e) => !is.object(e)).map((e) => {
                  chai.expect(() => ds.find("", e)).to.throw(Error);
               });

               let testProps1 = ["search","ret","minOrMax",null];
               testProps1.map((e1) =>
                  testProps1.map((e2) =>
                     testProps1.map((e3) =>
                        passIns.map((e4) =>
                           passIns.map((e5) =>
                              passIns.map((e6) => {
                                 let obj = {[e1]: e4, [e2]: e5, [e3]: e6};
                                 chai.expect(() => ds.findN("", obj)).to.throw(Error);
                  }))))));
            });
         });
         describe("Output Validation", function() {
            it("Should give correct output on correct inputs pt. 1", function() {
               let tmpDat = [{data:"VENUS",food:"asd",dog:{}},{data:"MARS",food:"ad",dog:{}},{data:"PLUTO",food:"sd",dog:{}}];
               let dc     = new DistanceComparator({dice:{val:"asd"}});
               let ds     = new DistanceSearch({data:tmpDat,comparator:dc});
               let out    = ds.findN({search:["food"],ret:["data"],minOrMax:"min"}, 5);
               chai.expect(out[0].data.data).to.equal("MARS");
            });
            it("Should give correct output on correct inputs pt. 2", function() {
               let tmpDat = [{data:"VENUS",food:"asd",dog:{}},{data:"MARS",food:"ad",dog:{}},{data:"PLUTO",food:"sd",dog:{}}];
               let dc     = new DistanceComparator({dice:{val:"asd"}});
               let ds     = new DistanceSearch({data:tmpDat,comparator:dc});
               let out    = ds.findN({search:["food"],ret:["data"],minOrMax:"max"}, 5);
               chai.expect(out[0].data.data).to.equal("VENUS");
            });
            it("Celeb data test", function() {
               let dc     = new DistanceComparator({dice:{val:"Sintra"}}, {human:true});
               let ds     = new DistanceSearch({data: celebData, comparator: dc});
               let out    = ds.findN({search:["name"],ret:["*"],minOrMax:"max"}, 10 );
            });
         });
      });
      describe("find", function() {
         describe("Input Validation", function() {
            it("Should throw error on invalid input", function() {
               let dc = new DistanceComparator("Word");
               let ds = new DistanceSearch({data:[{}],comparator:dc});
               chai.expect(() => ds.findClosest()).to.throw(Error);
               passIns.filter((e) => !is.object(e)).map((e) => {
                  chai.expect(() => ds.find(e)).to.throw(Error);
               });

               let testProps1 = ["search","ret","minOrMax",null];
               testProps1.map((e1) =>
                  testProps1.map((e2) =>
                     testProps1.map((e3) =>
                        passIns.map((e4) =>
                           passIns.map((e5) =>
                              passIns.map((e6) => {
                                 let obj = {[e1]: e4, [e2]: e5, [e3]: e6};
                                 chai.expect(() => ds.find(obj)).to.throw(Error);
                  }))))));
            });
         });
         describe("Output Validation", function() {
            it("Should give correct output on correct inputs pt. 1", function() {
               let tmpDat = [{data:"VENUS",food:"asd",dog:{}},{data:"MARS",food:"ad",dog:{}},{data:"PLUTO",food:"sd",dog:{}}];
               let dc = new DistanceComparator({dice:{val:"asd"}});
               let ds = new DistanceSearch({data:tmpDat,comparator:dc});
               let out = ds.find({search:["food"],ret:["data"], minOrMax:"min"});
               chai.expect(out.data.data).to.equal("MARS");
            });
            it("Should give correct output on correct inputs pt. 2", function() {
               let tmpDat = [{data:"VENUS",food:"asd",dog:{}},{data:"MARS",food:"ad",dog:{}},{data:"PLUTO",food:"sd",dog:{}}];
               let dc = new DistanceComparator({dice:{val:"asd"}});
               let ds = new DistanceSearch({data:tmpDat,comparator:dc});
               let out = ds.find({search:["food"],ret:["data"],minOrMax:"max"});
               chai.expect(out.data.data).to.equal("VENUS");
            });
         });
      });

   });
});
