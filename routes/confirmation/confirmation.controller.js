const path = require("path");
const {
  validateRouteData,
  getSessionData,
  getRouteByName,
  addViewPath,
  setFlashMessageContent,
  sendNotification
} = require("../../utils/index");

module.exports = async app => {
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
    
    // send email or sms here
    const session = getSessionData(req);
    let templateId = process.env.CONFIRM_TEMPLATE_ID_EMAIL;
    if (session.notify_type === "Sms") {
      templateId = process.env.CONFIRM_TEMPLATE_ID_SMS;
    }

    /*
      name: 'personal',
      code: 'A5G98S4K1',
      notify_type: 'Email',
      fullname: 'tim anney',
      email: 'email@email.com',
      expiry: '2019-01',
      nonce: '156768980827100',
      json: true 
    */

    const options = {
      personalisation: {
        expiryDate: session.expiry,
        confirmationNumber: session.code
      },
      reference: "Confirm"
    };

    await sendNotification({
      email: session.email,
      templateId: templateId,
      options
    });

    //

    res.render(name, { data: session });
  });

  // add code to send the initial email here
};
