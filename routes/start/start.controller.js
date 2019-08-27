const path = require("path");
const { getPreviousRoute } = require("../../utils/index");

module.exports = function(app) {
  console.log(getPreviousRoute("confirmation"));
  // add this dir to the views path
  app.set("views", [...app.get("views"), path.join(__dirname, "./")]);

  // redirect from "/" → "/start"
  app.get("/", (req, res) => res.redirect("/start"));
  app.get("/start", (req, res) => res.render("start"));
};
