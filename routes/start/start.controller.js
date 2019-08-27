path = require("path");
module.exports = function(app) {
  // add this dir to the views path
  app.set("views", [...app.get("views"), path.join(__dirname, "./")]);
  // redirect from "/" → "/start"
  app.get("/", (req, res) => res.redirect("/start"));
  app.get("/start", (req, res) => res.render("start"));
};
