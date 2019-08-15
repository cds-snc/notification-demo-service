const { checkSchema } = require("express-validator");
const {
  validateRedirect,
  checkErrors,
  sendNotification
} = require("./../../utils");
const winston = require("./../../config/winston.config");
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

const postName = async (req, res, next) => {
  const confirm = req.body.confirm;

  if (confirm !== "Yes") {
    return res.redirect("/offramp/name");
  }

  const result = await sendNotification(req, res, next);

  winston.debug(`send result ${result}`);

  return res.redirect(req.body.redirect);
};
