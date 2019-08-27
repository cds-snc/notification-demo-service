// configure routes
const configRoutes = app => {
  require("../routes/start/start.controller")(app);
  require("../routes/personal/personal.controller")(app);
  require("../routes/confirmation/confirmation.controller")(app);
};

const routes = [
  { name: "start", path: "/start" },
  { name: "personal", path: "/personal" },
  { name: "confirmation", path: "/confirmation" }
];

module.exports = {
  configRoutes,
  routes
};
