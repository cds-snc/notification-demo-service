const NotifyClient = require("notifications-node-client").NotifyClient;
const sendNotification = async req => {
  const data = req.body;
  const templateId = process.env.TEMPLATE_ID;
  const key = process.env.API_KEY;
  const baseUrl = process.env.API_BASE_URL;
  const notifyClient = new NotifyClient(baseUrl, key);

  const item = {
    email: data.email,
    fullname: data.fullname
  };

  return notifyClient
    .sendEmail(templateId, item.email, {
      personalisation: {
        name: item.fullname
      },
      reference: "Sign Up"
    })
    .then(response => {
      console.log(response.body);
      return true;
    })
    .catch(err => {
      console.log(err.message);
      return false;
    });
};

module.exports = {
  sendNotification
};
