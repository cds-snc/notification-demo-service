const { hasData } = require("./index");
const API = require("./../api");

describe("Test hasData function", () => {
  const user = API.getUser("A5G98S4K1");

  test("returns false for non-object", () => {
    expect(hasData("this is not an object", "personal.address.city")).toBe(
      false
    );
  });

  test("returns false for null object", () => {
    expect(hasData(null, "personal.address.city")).toBe(false);
  });

  test("returns false for empty object", () => {
    expect(hasData({}, "personal.address.city")).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(hasData({ obj: { string: "" } }, "obj.string")).toBe(false);
  });
});
