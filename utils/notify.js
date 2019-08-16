const NotifyClient = require("notifications-node-client").NotifyClient;
const key = process.env.API_KEY;
const baseUrl = process.env.API_BASE_URL;
const notifyClient = new NotifyClient(baseUrl, key);

const sendNotification = async (params = { email, templateId, options }) => {
  const { templateId, email, options } = params;
  try {
    const response = notifyClient.sendEmail(templateId, email, options);
    return response.body;
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

module.exports = {
  sendNotification,
  notifyClient
};
