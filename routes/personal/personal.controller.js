const { checkSchema } = require("express-validator");
const { validateRedirect, checkErrors } = require("./../../utils");
const { nameSchema, emailSchema } = require("./../../formSchemas.js");

module.exports = function(app) {
  app.get("/personal/name", (req, res) =>
    res.render("personal/name", { data: req.session })
  );
  app.post(
    "/personal/name",
    validateRedirect,
    checkSchema(nameSchema),
    checkErrors("personal/name"),
    postName
  );

  // email
  app.get("/personal/email", (req, res) =>
    res.render("personal/email", { data: req.session })
  );

  app.post(
    "/personal/email",
    validateRedirect,
    checkSchema(emailSchema),
    checkErrors("personal/email"),
    postEmail
  );
};

const postName = (req, res) => {
  const name = req.body.name;

  if (name !== "Yes") {
    return res.redirect("/offramp/name");
  }

  return res.redirect(req.body.redirect);
};

const postEmail = (req, res) => {
  return res.redirect(req.body.redirect);
};
