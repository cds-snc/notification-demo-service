const request = require("supertest");
const session = require("supertest-session");
const cheerio = require("cheerio");
const app = require("../../app.js");

describe("Test /login responses", () => {
  //login page
  test("it redirects to /login/code from /login", async () => {
    const response = await request(app).get("/login");
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toEqual("/login/code");
  });

  //login/code
  test("it returns a 200 response for /login/code", async () => {
    const response = await request(app).get("/login/code");
    expect(response.statusCode).toBe(200);
  });

  test("it renders the h1 text for /login/code", async () => {
    const response = await request(app).get("/login/code");

    const $ = cheerio.load(response.text);
    expect($("h1").text()).toEqual("Enter your personal access code");
  });

  test("it returns a 500 response if no redirect is provided", async () => {
    const response = await request(app).post("/login/code");
    expect(response.statusCode).toBe(500);
  });

  test("it autofocuses on the single input on the page", async () => {
    const response = await request(app).get("/login/code");
    const $ = cheerio.load(response.text);
    expect($("#code").attr("autofocus")).toEqual("autofocus");
  });

  test("it reloads /login/code with a 422 status if no code is provided", async () => {
    const response = await request(app)
      .post("/login/code")
      .send({ redirect: "/" });
    expect(response.statusCode).toBe(422);
  });

  describe("Error list tests", () => {
    test("it renders the error-list for /login/code", async () => {
      const response = await request(app)
        .post("/login/code")
        .send({ redirect: "/" });
      const $ = cheerio.load(response.text);
      expect($("title").text()).toMatch(/^Error:/);
      expect($(".error-list__header").text()).toEqual(
        "Please correct the errors on the page"
      );
      expect($(".error-list__list").children()).toHaveLength(1);
      expect($(".validation-message").text()).toEqual(
        "Error: Access code must be 9 characters"
      );
      expect($("#code").attr("aria-describedby")).toEqual("code-error");
      expect($("#code").attr("autofocus")).toEqual("autofocus");
    });

    test("it renders an inline error for /login/code with appropriate describedby", async () => {
      const response = await request(app)
        .post("/login/code")
        .send({ redirect: "/" });
      const $ = cheerio.load(response.text);
      expect($(".validation-message").text()).toEqual(
        "Error: Access code must be 9 characters"
      );
      expect($("#code").attr("aria-describedby")).toEqual("code-error");
    });
  });

  test("it does not allow a code more than 9 characters", async () => {
    const response = await request(app)
      .post("/login/code")
      .send({ code: "23XGY12111", redirect: "/" });
    expect(response.statusCode).toBe(422);
  });

  test("it does not allow a code less than 8 characters", async () => {
    const response = await request(app)
      .post("/login/code")
      .send({ code: "A23X", redirect: "/" });
    expect(response.statusCode).toBe(422);
  });

  test("it does not allow non-alphanumeric characters", async () => {
    const response = await request(app)
      .post("/login/code")
      .send({ code: "A23X456@", redirect: "/" });
    expect(response.statusCode).toBe(422);
  });

  const codes = ["A5G98S4K1", "a5g98S4K1", "a5g98s4k1"]; //check uppercase, lowercase and mixedcase
  codes.map(code => {
    test(`it redirects if a valid code is provided: "${code}"`, async () => {
      const response = await request(app)
        .post("/login/code")
        .send({ code, redirect: "/" });
      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toEqual("/");
    });
  });

  test("it does not allow non-numeric characters", async () => {
    const response = await request(app)
      .post("/login/code")
      .send({ code: "A23X456@1", redirect: "/" });
    expect(response.statusCode).toBe(422);
  });

  //it returns a 200 response for /login/dateOfBirth
  //access code test (look above for sin)

  /*
      These tests make sure that a date of birth which would ordinarily be is no longer accepted after
      a user logs in.

      After that, only the date of birth corressponding to the user in /api/user.json
      will be accepted.
    */
  describe("after entering an access code", () => {
    let authSession;

    beforeEach(async () => {
      authSession = session(app);
      const response = await authSession
        .post("/login/code")
        .send({ code: "A5G98S4K1", redirect: "/login/sin" })
        .then(() => {
          return authSession
            .post("/login/sin")
            .send({
              code: "A5G98S4K1",
              sin: "847339283",
              redirect: "/login/dateOfBirth"
            });
        });
      expect(response.statusCode).toBe(302);
    });
  });

  describe("Test /login/auth responses", () => {
    test('it returns a 302 response to the start page when no "redirect" query parameter', async () => {
      const response = await request(app).get("/login/auth");
      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toEqual("/start");
    });

    test('it returns a 200 response when containing a "redirect" query parameter', async () => {
      const response = await request(app).get("/login/auth?redirect=%2Furl");
      expect(response.statusCode).toBe(200);
    });

    test("it returns a 422 response for no posted value", async () => {
      const response = await request(app).post("/login/auth");
      expect(response.statusCode).toBe(422);
    });

    const badAuths = ["", null, "dinosaur", "10.0", "10.000", "-10", ".1"];
    badAuths.map(auth => {
      test(`it returns a 422 for a bad posted value: "${auth}"`, async () => {
        const response = await request(app)
          .post("/login/auth")
          .send({ auth });
        expect(response.statusCode).toBe(422);
      });
    });

    const goodAuths = ["0", "10", "10.00", ".10"];
    goodAuths.map(auth => {
      test(`it returns a 302 for a good posted value: "${auth}"`, async () => {
        const response = await request(app)
          .post("/login/auth?redirect=%2Furl")
          .send({ auth });
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toEqual("/url");
      });
    });

    test('it returns a 302 response to the start page when posting a good value but no "redirect" query parameter', async () => {
      const response = await request(app)
        .post("/login/auth")
        .send({ auth: "10.00" });
      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toEqual("/start");
    });

    const badRedirects = ["https%3A%2F%2Fevilcompany.com", "evilcompany.com"];
    badRedirects.map(redirect => {
      test(`it throws a 500 error for a non-relative "redirect" query parameter link: "${redirect}"`, async () => {
        const response = await request(app)
          .post(`/login/auth?redirect=${redirect}`)
          .send({ auth: "10.00" });
        expect(response.statusCode).toBe(500);
        expect(response.text).toMatch(
          "Error: [POST /login/auth] can only redirect to relative URLs"
        );
      });
    });
  });
});
