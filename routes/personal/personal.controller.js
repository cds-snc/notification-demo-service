path = require("path");
const { checkSchema } = require("express-validator");
const { doRedirect, checkErrors } = require("./../../utils");
const { Schema } = require("./schema.js");

module.exports = function(app) {
  // add this dir to the views path
  app.set("views", [...app.get("views"), path.join(__dirname, "./")]);

  app.get("/personal/identity", (req, res) => {
    res.render("personal", { data: req.session });
  });
  app.post(
    "/personal/identity",
    checkSchema(Schema),
    checkErrors("personal"),
    doRedirect
  );
};
