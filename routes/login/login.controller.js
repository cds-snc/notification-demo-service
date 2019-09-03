const path = require("path");
const { checkSchema } = require("express-validator");
const {
  doRedirect,
  checkErrors,
  getRouteByName,
  addViewPath,
  getSessionData
} = require("./../../utils");

const { Schema } = require("./schema.js");

module.exports = app => {
  const name = "login";
  const route = getRouteByName(name);

  addViewPath(app, path.join(__dirname, "./"));

  app.get(route.path, (req, res) => {
    const params = { name, data: getSessionData(req) };
    res.render(name, params);
  });
  app.post(route.path, checkSchema(Schema), checkErrors(name), doRedirect);
};
