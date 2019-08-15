const { checkSchema } = require("express-validator");
const {
  validateRedirect,
  checkErrors,
  sendNotification
} = require("./../../utils");
const { reviewSchema } = require("./../../formSchemas.js");

module.exports = function(app) {
  app.get("/confirmation", (req, res) =>
    res.render("confirmation/confirmation", { data: req.session })
  );

  /*

  app.post(
    "/review",
    validateRedirect,
    checkSchema(reviewSchema),
    checkErrors("confirmation/review"),
    sendNotification,
    (req, res) => res.redirect(req.body.redirect)
  );
  */
};
