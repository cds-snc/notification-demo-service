const { checkSchema } = require("express-validator");
const {
  validateRedirect,
  checkErrors,
  sendNotification
} = require("./../../utils");

const { nameSchema } = require("./../../formSchemas.js");

module.exports = function(app) {
  app.get("/personal/identity", (req, res) => {
    res.render("personal/identity", { data: req.session });
  });
  app.post(
    "/personal/identity",
    validateRedirect,
    checkSchema(nameSchema),
    (req, res, next) => {
      // check for "no" i.e. don't send me notifications
      // && just send them to the offramp
      const confirm = req.body.confirm;

      if (confirm !== "Yes") {
        return res.redirect("/offramp/identity");
      }

      next();
    },
    checkErrors("personal/identity"),
    postName
  );
};

const postName = async (req, res, next) => {
  const confirm = req.body.confirm;

  if (confirm !== "Yes") {
    return res.redirect("/offramp/identity");
  }

  const data = req.body;
  const templateId = process.env.CONFIRM_TEMPLATE_ID;
  const session = req.session;

  const options = {
    personalisation: {
      accesscode: session.confirmCode.code
    },
    reference: "Confirm"
  };

  await sendNotification({
    email: data.email,
    templateId: templateId,
    options
  });

  return res.redirect(req.body.redirect);
};
