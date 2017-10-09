"use strict"

const DistanceComparator = require("../distancecomparator.js");
const chai               = require("chai");
const is                 = require("is");

const RandExp = require('randexp');
const PROP_NAME_REGEX  = /^[a-zA-Z][a-zA-Z0-9]{3,6}/;
const propGen   = new RandExp(PROP_NAME_REGEX); // .gen()

describe("DistanceComparator", function() {
   describe("Construction", function() {
      describe("Parameter validation: valid", function() {
         it("Should return DistanceComparator when passed correct inputs.", function() {
            let vals = ["val",/Word/g,() => {}];
            // Test all combinations of vals
            vals.map((e1) =>
               vals.map((e2) =>
                  chai.expect(
                     (new DistanceComparator(e1, e2)) instanceof DistanceComparator).to.be.true));

            let objs1 = [{dice:{val:"Word"}},{leven:{val:"Word"}}];
            let objs2 = [{human:true},{human:true}];
            objs1.map((e1) =>
               objs2.map((e2) =>
                  chai.expect(
                     (new DistanceComparator(e1, e2)) instanceof DistanceComparator).to.be.true));
         });
      });
      describe("Parameter validation: invalid", function() {
         it("Should return DistanceComparator when passed correct inputs.", function() {
            let vals = [1,{},[],Symbol(""),null];
            // Test all combinations of vals
            vals.map((e1) =>
               vals.map((e2) =>
                  chai.expect(() =>
                     (new DistanceComparator(e1, e2)) instanceof DistanceComparator).to.throw(Error)));

            let objs1 = [{dice:{va:"Word"}},{levn:{al:"Word"}},{d:{v:4}},{dice:{fa:3}}];
            let objs2 = [{huma:true},{human:false},{h:2},{Human:3},{human: []}];
            objs1.map((e1) =>
               objs2.map((e2) =>
                  chai.expect(() =>
                     (new DistanceComparator(e1, e2)) instanceof DistanceComparator).to.throw(Error)));
         });
      });
   });
   describe("Symbol Class Testing", function() {
      it("Should be able to retrieve symbol property from instance"
           + " and test for it's presence on the object.", function() {
            let dc = new DistanceComparator(/s/);
            let syb = dc.symbol;
            chai.expect(is.symbol(syb)).to.be.true;
            chai.expect(dc[syb] === syb);
      });
      it("Should be able to retrieve symbol property from static Class"
           + " and test for it's presence on the object.", function() {
            let dc = new DistanceComparator(/s/);
            let syb = DistanceComparator.symbol;
            chai.expect(is.symbol(syb)).to.be.true;
            chai.expect(dc[syb] === syb);
      });
      it("Should be able to use isClass on instances of DistanceComparator.", function() {
            let dc = new DistanceComparator(/s/);
            let dc2 = new DistanceComparator(/s/);
            chai.expect(dc.isClass(dc2)).to.be.true;
      });
      it("Should be able to us isClass on static Class", function() {
            let dc = new DistanceComparator(/s/);
            chai.expect(DistanceComparator.isClass(dc)).to.be.true;
      });
   });
   describe("comp", function() {
      describe("Input Validation", function() {
         it("Should throw an error on empty inputs", function() {
            let dc = new DistanceComparator(/s/);
            chai.expect(() => dc.comp()).to.throw(Error);
         });
         it("Should throw an error on valid first parameter and invalid second parameter", function() {
            let dc = new DistanceComparator(/s/);
            for(let i = 0; i < 100; i++) {
               let rndStr = propGen.gen();
               if(rndStr === "min" || rndStr === "max") continue;
               chai.expect(() => dc.comp(1,rndStr)).to.throw(Error);
            }
         });
         it("Should throw an error on split that doesn't return array", function() {
            let dc = new DistanceComparator(/s/, ()=> {});
            chai.expect(() => dc.comp(1,"min")).to.throw(Error);
         });
         it("Should throw an error on comps that doesn return numbers single", function() {
            let dc = new DistanceComparator(() => "");
            chai.expect(() => dc.comp(1,"min")).to.throw(Error);
         });
         it("Should throw an error on comps that doesn return numbers array", function() {
            let dc = new DistanceComparator(() => "", (val) => val.split(/ /g).map((e) => e - 0));
            chai.expect(() => dc.comp("1 2 3 4 5","min")).to.throw(Error);
         });
      });
      describe("Output validation", function() {
         it("Output validation pt. 1", function() {
            let dc = new DistanceComparator((a) => a, (val) => val.split(/ /g).map((e) => e - 0));
            chai.expect(dc.comp("1 2 3 4 5","min")).to.equal(1);
            chai.expect(dc.comp("1 2 3 4 5","max")).to.equal(5);
         });
         it("Output validation pt. 2", function() {
            let dc = new DistanceComparator("Word", " ");
            chai.expect(dc.comp("Word ward weird dog","min")).to.equal(0);
            chai.expect(dc.comp("Word ward weird dog","max")).to.equal(1);

         });
         it("Output validation pt. 3", function() {
            let dc = new DistanceComparator(/Word/g, " ");
            chai.expect(dc.comp("Word ward weird dog","min")).to.equal(0);
            chai.expect(dc.comp("Word ward weird dog","max")).to.equal(1);
         });
         it("Output validation pt. 4", function() {
            let dc = new DistanceComparator(/Word/g);
            chai.expect(dc.comp("Word","max")).to.equal(1);
            chai.expect(dc.comp("Word","min")).to.equal(1);
            chai.expect(dc.comp("Ward","min")).to.equal(0);
            chai.expect(dc.comp("Ward","min")).to.equal(0);
         });

         it("Output validation pt. 5", function() {
            let dc = new DistanceComparator((a) => (a - 0));
            chai.expect(dc.comp("1","min")).to.equal(1);
            chai.expect(dc.comp("1","max")).to.equal(1);
         });
         it("Output validation pt. 6", function() {
            let dc = new DistanceComparator({leven: {val:"healed"}});
            chai.expect(dc.comp("sealed","max")).to.equal(1);
         });
         it("Output validation pt. 7", function() {
            let dc = new DistanceComparator({dice: {val:"healed"}});
            chai.expect(dc.comp("sealed","max")).to.equal(0.8);
         });
         it("Output validation pt. 8", function() {
            let dc = new DistanceComparator({dice: {val:"Olive-green table for sale, in extremely good condition."}});
            chai.expect(dc.comp("For sale: table in very good  condition, olive green in colour.","max")).to.equal(0.7073170731707317);
         });
         it("Output validation pt. 9", function() {
            let dc = new DistanceComparator({dice: {val:"John"}}, {human: true});
            chai.expect(dc.comp("John H. Doe","max")).to.equal(1);
         });
         it("Output validation pt. 10", function() {
            let dc = new DistanceComparator({leven: {val:"Doe"}}, {human: true});
            chai.expect(dc.comp("John H. Doe","min")).to.equal(0);
         });
         it("Output validation pt. 11", function() {
            let dc = new DistanceComparator({dice: {val:"Jihn"}}, {human: true});
            chai.expect(dc.comp("John H. Doe","max")).to.equal(0.3333333333333333);
         });
         it("Output validation pt. 12", function() {
            let dc = new DistanceComparator({leven: {val:"Dob"}}, {human: true});
            chai.expect(dc.comp("John H. Doe","min")).to.equal(1);
         });
      });
   });
});
