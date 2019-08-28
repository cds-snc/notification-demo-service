const path = require("path");
const nn = require("nonce-next");
const { checkSchema } = require("express-validator");
const {
  doRedirect,
  checkErrors,
  checkNonce,
  getRouteByName
} = require("./../../utils");
const { Schema } = require("./schema.js");

module.exports = function(app) {
  // add this dir to the views path
  const name = "personal";
  const route = getRouteByName(name);

  app.set("views", [...app.get("views"), path.join(__dirname, "./")]);

  app.get(route.path, (req, res) => {
    res.render(name, { data: req.session, name, nonce: nn.generate() });
  });

  app.post(
    route.path,
    checkNonce,
    checkSchema(Schema),
    checkErrors(name),
    doRedirect
  );
};
