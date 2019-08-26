const { checkSchema } = require("express-validator");
const { validateRedirect, sendNotification } = require("./../../utils");
const { notifySchema } = require("./../../formSchemas.js");

module.exports = function(app) {
  app.get("/notify", (req, res) => {
    res.render("notify/confirm", { data: req.session });
  });
  app.post("/notify", validateRedirect, checkSchema(notifySchema), postName);
};

const postName = async (req, res, next) => {
  const confirm = req.body.confirm;

  if (confirm !== "Yes") {
    return res.redirect("/offramp/identity");
  }

  if(!process.env.CONFIRM_TEMPLATE_ID){
    throw new Error("CONFIRM_TEMPLATE_ID not defined")
  }

  const templateId = process.env.CONFIRM_TEMPLATE_ID;
  const session = req.session;

  const options = {
    personalisation: {
      expiryDate: session.expiry,
      confirmationNumber: session.confirmCode.code
    },
    reference: "Confirm"
  };

  await sendNotification({
    email: session.email,
    templateId: templateId,
    options
  });

  return res.redirect(req.body.redirect);
};
