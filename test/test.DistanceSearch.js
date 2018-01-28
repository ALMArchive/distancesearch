"use strict"

import DistanceSearch from "../distancesearch";
import DistanceComparator from "../distancecomparator";
import chai from "chai";
import is from "is";
import celebData from "../node_modules/celebs/data/json/no-views/pantheon.json";

const passIns = ["",1,()=>{},[],{},null,undefined,Symbol("")];

describe("DistanceSearch", function() {
   describe("Construction", function() {
      describe("Parameter validation: valid", function() {
         it("Should return DistanceSearch when passed correct inputs.", function() {
            let dc = new DistanceComparator("Word");
            let ds = new DistanceSearch({data:[{}],comparator:dc});
            chai.expect(ds.constructor.name === "DistanceSearch").to.be.true;
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
            });
         });
         describe("Output Validation", function() {
            it("Should give correct output on correct inputs pt. 1", function() {
               let tmpDat = [{data:"VENUS",food:"asd",dog:{}},{data:"MARS",food:"ad",dog:{}},{data:"PLUTO",food:"sd",dog:{}}];
               let dc     = new DistanceComparator({dice:{val:"asd"}});
               let ds     = new DistanceSearch({data:tmpDat});
               let out    = ds.findN({search:["food"],ret:["data"],minOrMax:"min"}, dc, 5);
               chai.expect(out[0].data.data).to.equal("MARS");
            });
            it("Should give correct output on correct inputs pt. 2", function() {
               let tmpDat = [{data:"VENUS",food:"asd",dog:{}},{data:"MARS",food:"ad",dog:{}},{data:"PLUTO",food:"sd",dog:{}}];
               let dc     = new DistanceComparator({dice:{val:"asd"}});
               let ds     = new DistanceSearch({data:tmpDat});
               let out    = ds.findN({search:["food"],ret:["data"],minOrMax:"max"}, dc, 5);
               chai.expect(out[0].data.data).to.equal("VENUS");
            });
            it("Celeb data test", function() {
               let dc     = new DistanceComparator({dice:{val:"sintra"}}, {human:true});
               let ds     = new DistanceSearch({data: celebData});
               let out    = ds.findN({search:["name"],ret:["*"],minOrMax:"max"}, dc, 10 );
               chai.expect(out[0].data.name).to.equal("Nancy Sinatra");
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
            });
         });
         describe("Output Validation", function() {
            it("Should give correct output on correct inputs pt. 1", function() {
               let tmpDat = [{data:"VENUS",food:"asd",dog:{}},{data:"MARS",food:"ad",dog:{}},{data:"PLUTO",food:"sd",dog:{}}];
               let dc = new DistanceComparator({dice:{val:"asd"}});
               let ds = new DistanceSearch({data:tmpDat});
               let out = ds.find({search:["food"],ret:["data"], minOrMax:"min"}, dc);
               chai.expect(out.data.data).to.equal("MARS");
            });
            it("Should give correct output on correct inputs pt. 2", function() {
               let tmpDat = [{data:"VENUS",food:"asd",dog:{}},{data:"MARS",food:"ad",dog:{}},{data:"PLUTO",food:"sd",dog:{}}];
               let dc = new DistanceComparator({dice:{val:"asd"}});
               let ds = new DistanceSearch({data:tmpDat});
               let out = ds.find({search:["food"],ret:["data"],minOrMax:"max"}, dc);
               chai.expect(out.data.data).to.equal("VENUS");
            });
         });
      });

   });
});
