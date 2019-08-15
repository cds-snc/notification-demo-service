const { checkSchema } = require("express-validator");
const {
  validateRedirect,
  checkErrors,
  sendNotification
} = require("./../../utils");
const { nameSchema } = require("./../../formSchemas.js");

module.exports = function(app) {
  app.get("/personal/identity", (req, res) => {
    res.render("personal/identity", { data: req.session });
  });
  app.post(
    "/personal/identity",
    validateRedirect,
    checkSchema(nameSchema),
    checkErrors("personal/identity"),
    postName
  );
};

const postName = async (req, res, next) => {
  const confirm = req.body.confirm;

  if (confirm !== "Yes") {
    return res.redirect("/offramp/identity");
  }

  await sendNotification(req, res, next);

  return res.redirect(req.body.redirect);
};
