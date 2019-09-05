/**
 * This request middleware checks for the "lang" query.
 * If it finds a query parameter "lang=fr" or "lang=en", it will set a "lang" cookie to whichever value.
 *
 * From this point onwards, all of the site's content will be in the user's preferred language.
 */

const oneHour = 1000 * 60 * 60 * 1;

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
 * get the domain for the app from the request obj
 */
const getDomain = req => {
  const protocol = getHostProtocol(req);
  const host = req.headers.host;
  return `${protocol}://${host}`;
};

const getHostProtocol = req => {
  if (req.secure) {
    return "https";
  }

  return "http";
};

module.exports = {
  checkLangQuery,
  getDomain,
  getHostProtocol
};
