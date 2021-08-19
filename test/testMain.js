const app = require("../src/main.js");
const assert = require("assert");
const expect = require("chai").expect;

describe("Test main application", function (){
    it("should return 157 items when no filter is applied", async () => {
        const res = await app.get_data(10, x => true);//.then(res => ).catch(e=>console.log(e));
        assert.strictEqual(res.length, 157);
    })
    it("should filter out all items not being commissioned in percentage", async () => {
        const res = await app.get_data(10, x => true);
        const res2 = await app.get_data(10, x=>x.commission.max.unit==='%');

        const contains_percent = res.filter(x => x.commission.max.unit === '%');
        const no_percent = res.filter(x => x.commission.max.unit !== '%');
        assert.deepStrictEqual(res2.filter(x=>x.commission.max.unit==="%"), res2);
        assert.deepStrictEqual(res2, contains_percent);
        assert.deepStrictEqual(no_percent.filter(x=>!res2.includes(x)), no_percent);

    })
})