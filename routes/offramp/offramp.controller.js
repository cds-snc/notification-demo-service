module.exports = function(app) {
  app.get("/offramp/identity", (req, res) =>
    res.render("offramp/identity", { data: req.session })
  );
};
