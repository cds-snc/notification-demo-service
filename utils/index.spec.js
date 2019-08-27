const { isValidDate } = require("./index");

describe("Has valid date", () => {
  test("returns true for valid date", () => {
    expect(isValidDate("2019-01")).toBe(true);
  });

  test("returns false for bad date", () => {
    expect(isValidDate("20191-01")).toBe(false);
  });

  test("returns false for date with bad format", () => {
    expect(isValidDate("2019/01")).toBe(false);
  });

  test("returns false for date with wrong format", () => {
    expect(isValidDate("2019-01-01")).toBe(false);
  });
});
