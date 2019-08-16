const NotifyClient = require("notifications-node-client").NotifyClient;
const key = process.env.API_KEY;
const baseUrl = process.env.API_BASE_URL;
const notifyClient = new NotifyClient(baseUrl, key);

const sendNotification = async ({ email, templateId, options }) => {
  try {
    const response = notifyClient.sendEmail(templateId, email, options);
    console.log(response.body);
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

module.exports = {
  sendNotification
};
