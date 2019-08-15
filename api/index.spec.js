const API = require("./index");

test("returns expected user with correct login.code", () => {
  const user = API.getUser("A5G98S4K1");
  expect(user).not.toBe(null);
  expect(user.confirmCode.code).toBe("5H3P9IO5816");
});

test("returns null with a nonexistent login.code", () => {
  const user = API.getUser("H3LLY34H");
  expect(user).toBe(null);
});
