const path = require("path");
const nn = require("nonce-next");
const {
  getNextRoute,
  getRouteByName,
  validateRouteData
} = require("../../utils/index");

//
const formData = {
  fullname: "my_value",
  email: "",
  json: true,
  nonce: nn.generate(60000),
  expiry: ""
};

module.exports = function(app) {
  const name = "start";
  const route = getRouteByName(name);
  // add this dir to the views path
  app.set("views", [...app.get("views"), path.join(__dirname, "./")]);

  // redirect from "/" → "/start"
  app.get("/", (req, res) => res.redirect(route.path));
  app.get(route.path, async (req, res) => {
    console.log(await validateRouteData(req, "personal", formData));
    res.render(name, { nextRoute: getNextRoute(name).path });
  });
};
