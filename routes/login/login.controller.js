const { validationResult, checkSchema } = require("express-validator");
const {
  errorArray2ErrorObject,
  validateRedirect
} = require("./../../utils");
const {
  loginSchema,
} = require("./../../formSchemas.js");
const API = require("../../api");

module.exports = function(app) {
  // redirect from "/login" → "/login/code"
  app.get("/login", (req, res) => res.redirect("/login/code"));
  app.get("/login/code", (req, res) =>
    res.render("login/code", { data: req.session || {} })
  );
  app.post(
    "/login/code",
    validateRedirect,
    checkSchema(loginSchema),
    postLoginCode
  );
};

const postLoginCode = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // clear session
    req.session = null;

    return res.status(422).render("login/code", {
      data: { code: req.body.code } || {},
      errors: errorArray2ErrorObject(errors)
    });
  }

  let user = API.getUser(req.body.code || null);

  if (!user) {
    throw new Error(
      `[POST ${req.path}] user not found for access code "${req.body.code}"`
    );
  }

  req.session = user;
  return res.redirect(req.body.redirect);
};