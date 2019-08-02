const winston = require("../config/winston.config");
const NotifyClient = require("notifications-node-client").NotifyClient;
const sendNotification = (req, res, next) => {
  const data = req.session;
  const templateId = process.env.TEMPLATE_ID;
  const key = process.env.API_KEY;
  const baseUrl = process.env.API_BASE_URL;
  const notifyClient = new NotifyClient(baseUrl, key);
  const item = {
    email: data.personal.email,
    first_name: data.personal.firstName
  };

  notifyClient
    .sendEmail(templateId, item.email, {
      personalisation: {
        name: item.first_name
      },
      reference: "Sign Up"
    })
    .then(response => {
      winston.info(response.body);
      return next();
    })
    .catch(err => {
      winston.error(err.message);
      return next();
    });
};

module.exports = {
  sendNotification
};
