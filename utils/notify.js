const NotifyClient = require("notifications-node-client").NotifyClient;

const sendNotification = (req, res, next) => {
  const templateId = "064c0939-ffa6-46cc-8da7-53aa4081f14e";
  const liveKey = "-";

  const notifyClient = new NotifyClient(liveKey);

  const item = {
    email: "-",
    first_name: "tim",
    link: "https://notification.cdssandbox.xyz/register"
  };

  /*
  notifyClient
    .sendEmail(templateId, item.email, {
      personalisation: {
        first_name: item.first_name,
        click_here: item.link
      },
      reference: "Sign Up"
    })
    .then(response => console.log(response.body))
    .catch(err => console.log(err.message));
  */

  //console.log(req.session.confirmCode.code);
  return next();
};

module.exports = {
  sendNotification
};
