path = require("path");
module.exports = function(app) {
  // add this dir to the views path
  app.set("views", [...app.get("views"), path.join(__dirname, "./")]);
  app.get("/confirmation", (req, res) =>
    res.render("confirmation", { data: req.session })
  );
};
