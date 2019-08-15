const request = require("supertest");
const cheerio = require("cheerio");
const app = require("../../app.js");
const API = require("../../api/index");

describe("Test /personal 200 responses", () => {
  const urls = ["/personal/identity"];

  urls.map(url => {
    test(`it returns a 200 response for the path: "${url}" path`, async () => {
      const response = await request(app).get(url);
      expect(response.statusCode).toBe(200);
    });
  });
});
