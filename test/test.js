var main = require("../index");
var expect = require("chai").expect;

// Test
let values = [];
for (let i = 0; i <= 26; ) {
  i += 5;
  values.push(main.getVWAPPenalty(i));
}

describe("My test", () => {
  it("function should output all expected values", () => {
    expect(1).to.be.oneOf(values);
    expect(0.8).to.be.oneOf(values);
    expect(0.6).to.be.oneOf(values);
    expect(0.4).to.be.oneOf(values);
    expect(0.2).to.be.oneOf(values);
    expect(0.001).to.be.oneOf(values);
  });
});
