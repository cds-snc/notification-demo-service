const path = require("path");
const nn = require("nonce-next");
const { checkSchema } = require("express-validator");
const { doRedirect, checkErrors, checkNonce } = require("./../../utils");
const { Schema } = require("./schema.js");

module.exports = function(app) {
  // add this dir to the views path
  app.set("views", [...app.get("views"), path.join(__dirname, "./")]);

  app.get("/personal/identity", (req, res) => {
    res.render("personal", { data: req.session, nonce: nn.generate() });
  });
  app.post(
    "/personal/identity",
    checkNonce,
    checkSchema(Schema),
    checkErrors("personal"),
    doRedirect
  );
};
