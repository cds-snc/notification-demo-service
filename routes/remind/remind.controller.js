module.exports = function(app) {
  app.get("/remind", (req, res) => {
    res.render("remind/index", { data: req.session });
  });
};
