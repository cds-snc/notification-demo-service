// import environment variables.
require("dotenv").config();

// import node modules.
const express = require("express"),
  cookieParser = require("cookie-parser"),
  compression = require("compression"),
  helmet = require("helmet"),
  sassMiddleware = require("node-sass-middleware"),
  path = require("path"),
  cookieSession = require("cookie-session"),
  cookieSessionConfig = require("./config/cookieSession.config"),
  { hasData, checkPublic, checkLangQuery } = require("./utils"),
  csp = require("./config/csp.config"),
  { configRoutes } = require("./config/routes.config");

// initialize application.
var app = express();

// @ todo
// build pipeline
// storing data
// register step - check if completed
// if not redirect to prev step
// auth

// general app configuration.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.app_session_secret));
app.use(require("./config/i18n.config").init);

// in production: use redis for sessions
// but this works for now
app.use(cookieSession(cookieSessionConfig));

// in production: precompile CSS
app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    debug: false,
    indentedSyntax: false, // look for .scss files, not .sass files
    sourceMap: true,
    outputStyle: "compressed"
  })
);

// public assets go here (css, js, etc)
app.use(express.static(path.join(__dirname, "public")));

// dnsPrefetchControl controls browser DNS prefetching
// frameguard to prevent clickjacking
// hidePoweredBy to remove the X-Powered-By header
// hsts for HTTP Strict Transport Security
// ieNoOpen sets X-Download-Options for IE8+
// noSniff to keep clients from sniffing the MIME type
// xssFilter adds some small XSS protections
app.use(helmet());
app.use(helmet.contentSecurityPolicy({ directives: csp }));
// gzip response body compression.
app.use(compression());

app.use(checkPublic);
app.use(checkLangQuery);

// Adding values/functions to app.locals means we can access them in our templates
app.locals.GITHUB_SHA = process.env.GITHUB_SHA || null;
app.locals.hasData = hasData;

// view engine setup
app.locals.basedir = path.join(__dirname, "./views");
app.set("views", [path.join(__dirname, "./views")]);
app.set("view engine", "pug");

configRoutes(app);

module.exports = app;