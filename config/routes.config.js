// configure routes
const routes = [
  { name: "start", path: "/start" },
  { name: "personal", path: "/personal" },
  { name: "confirmation", path: "/confirmation" },
  { name: "clear", path: "/clear" }
];

const configRoutes = app => {
  app.set("appRoutes", routes);
  require("../routes/clear/clear.controller")(app);
  require("../routes/start/start.controller")(app);
  require("../routes/personal/personal.controller")(app);
  require("../routes/confirmation/confirmation.controller")(app);
  require("../routes/global/global.controller")(app);
};

const Route = { name: false, path: false, redirect: false };

module.exports = {
  configRoutes,
  Route,
  routes
};
