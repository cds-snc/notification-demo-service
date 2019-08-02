const { hasData } = require("./index");
const API = require("./../api");

describe("Test hasData function", () => {
  const user = API.getUser("A5G98S4K1");

  test("returns false for non-object", () => {
    expect(hasData(user, "login.code")).toBe(true);
  });

  test("returns false for non-object", () => {
    expect(hasData("this is not an object", "confirmCode.code")).toBe(false);
  });

  test("returns false for null object", () => {
    expect(hasData(null, "confirmCode.code")).toBe(false);
  });

  test("returns false for empty object", () => {
    expect(hasData({}, "confirmCode.code")).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(hasData({ obj: { string: "" } }, "obj.string")).toBe(false);
  });
});
