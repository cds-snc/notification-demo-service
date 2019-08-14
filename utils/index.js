const API = require("./../api");
const { validationResult } = require("express-validator");
const { sendNotification } = require("./notify");
const winston = require("../config/winston.config");

/*
  original format is an array of error objects: https://express-validator.github.io/docs/validation-result-api.html
  convert that to an object where the key is the parameter name and value is the error object
  ie,
  [
    { param: 'name', msg: 'Cannot be empty', ... },
    { param: 'number', msg: 'Cannot be empty', ... }
  ]
  to
  {
    name: { param: 'name', msg: 'Cannot be empty', ... },
    number: { param: 'number', msg: 'Cannot be empty', ... }
  }
*/
const errorArray2ErrorObject = (errors = []) => {
  return errors.array({ onlyFirstError: true }).reduce((map, obj) => {
    map[obj.param] = obj;
    return map;
  }, {});
};

/* Middleware */
const oneHour = 1000 * 60 * 60 * 1;

const isValidDate = dateString => {
  const regEx = /^\d{4}-\d{2}$/; // YYYY-MM
  if (!dateString.match(regEx)) {
    return false; // Invalid format
  }

  var d = new Date(`${dateString}-01`);
  var dNum = d.getTime();

  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 7) === dateString;
};

/**
 * This request middleware checks for the "lang" query.
 * If it finds a query parameter "lang=fr" or "lang=en", it will set a "lang" cookie to whichever value.
 *
 * From this point onwards, all of the site's content will be in the user's preferred language.
 */
const checkLangQuery = function(req, res, next) {
  let lang = req.query.lang;

  if (lang === "en" || lang === "fr") {
    res.cookie("lang", lang, {
      httpOnly: true,
      maxAge: oneHour,
      sameSite: "strict"
    });
  }

  return next();
};

/**
 * This request middleware checks if we are visiting a public path
 * For most of the pages in our app, we expect to have user data in the session
 * If we're visiting one of the non-public paths, it will load user data into the session
 *
 * We _could_ redirect people to the "/start" page if they're on the wrong URL,
 * but since this app is for demo purposes at this point, we should just ensure
 * that a user session exists whatever page you end up on.
 */
const checkPublic = function(req, res, next) {
  const publicPaths = ["/", "/clear", "/start", "/login/code"];
  if (publicPaths.includes(req.path)) {
    return next();
  }

  return next();
};

/**
 * This request middleware is used to add an "auth" step to some of our pages
 *
 * If we are visiting one of our edit pages, we want to ask users
 * another question before we let them edit their info.
 *
 * This means that we want to show the /login/auth page the first time, but not afterwards
 *
 * We don't want to show the /login/auth page if
 *
 * - we're running tests
 * - we have already set "auth" to true
 *
 * Otherwise, we redirect to the /login/auth page and put the redirect query in the URL
 */
const doAuth = function(req, res, next) {
  // if running tests, do nothing
  if (process.env.NODE_ENV === "test") {
    return next();
  }

  // go to original url if "auth" is truthy
  const { login: { auth = null } = {} } = req.session;
  if (auth) {
    return next();
  }

  return res.redirect(`/login/auth?redirect=${encodeURIComponent(req.path)}`);
};

/**
 * Middleware function that runs our error validation
 *
 * Since returning our errors is looking like a lot of boilerplate code, this function:
 *
 * - checks if the request parameters match the schema
 * - checks if there are errors
 * - if no errors, "next()"
 * - if there are errors,
 *   - send back a 422 status
 *   - add the session data to the template
 *   - put the request parameters into the template (except for the redirect)
 *   - render the passed-in template string
 *
 * By including this function, we can cut down our post functions by about half
 *
 * @param string template The template string to render if errors are found (should match the one used for the GET request)
 */
const checkErrors = template => {
  return (req, res, next) => {
    winston.debug(JSON.stringify(req.session));
    const errors = validationResult(req);

    // copy all posted parameters, but remove the redirect
    let body = Object.assign({}, req.body);
    delete body.redirect;
    req.session = { ...req.session, ...body };

    if (!errors.isEmpty()) {
      return res.status(422).render(template, {
        data: req.session,
        body,
        errors: errorArray2ErrorObject(errors)
      });
    }

    return next();
  };
};

//POST functions that handle setting the login data in the session and handle redirecting to the next page or sending an error to the client.
//Note that this is not the only error validation, see routes defined above.
const validateRedirect = (req, res, next) => {
  let redirect = req.body.redirect || null;

  if (!redirect) {
    throw new Error(`[POST ${req.path}] 'redirect' parameter missing`);
  }
  return next();
};

/* Pug filters */

/**
 * @param {Object} obj the obj we're passing, most often 'data'
 * @param {String} key the key we're trying to access, passed as a string, not including the obj ref itself
 * ex. if we're trying to get to data.personal.maritalStatus
 * pass as hasData(data, 'personal.maritalStatus')
 */
const hasData = (obj, key) => {
  return key.split(".").every(x => {
    if (
      typeof obj != "object" ||
      obj === null ||
      !obj.hasOwnProperty(x) || // eslint-disable-line no-prototype-builtins
      obj[x] === null ||
      obj[x] === ""
    ) {
      return false;
    }
    obj = obj[x];
    return true;
  });
};

module.exports = {
  errorArray2ErrorObject,
  validateRedirect,
  sendNotification,
  checkErrors,
  doAuth,
  hasData,
  checkPublic,
  checkLangQuery,
  isValidDate
};
