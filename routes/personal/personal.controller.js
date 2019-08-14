const { checkSchema } = require("express-validator");
const { validateRedirect, checkErrors } = require("./../../utils");
const { nameSchema } = require("./../../formSchemas.js");

module.exports = function(app) {
  app.get("/personal/name", (req, res) => {
    res.render("personal/name", { data: req.session });
  });
  app.post(
    "/personal/name",
    validateRedirect,
    checkSchema(nameSchema),
    checkErrors("personal/name"),
    postName
  );
};

const postName = (req, res) => {
  const name = req.body.name;

  if (name !== "Yes") {
    return res.redirect("/offramp/name");
  }

  return res.redirect(req.body.redirect);
};
