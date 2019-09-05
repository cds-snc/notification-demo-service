const path = require("path");
const {
  validateRouteData,
  getSessionData,
  getRouteByName,
  addViewPath,
  setFlashMessageContent
} = require("../../utils/index");

module.exports = app => {
  const name = "confirmation";
  const route = getRouteByName(name);

  addViewPath(app, path.join(__dirname, "./"));

  app.get(route.path, async (req, res) => {
    // ⚠️ experimental
    // validate data from previous step
    // see if we should be allowed to reach this step
    const result = await validateRouteData(req, "personal");
    if (!result.status) {
      setFlashMessageContent(req, result.errors);
      return res.redirect(getRouteByName("personal").path);
    }

    //
    // send email or sms here
    /*
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
      email: data.email,
      templateId: templateId,
      options
    });
    */

    //

    res.render(name, { data: getSessionData(req) });
  });

  // add code to send the initial email here
};
