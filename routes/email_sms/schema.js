const Schema = {
  notify_type: {
    isIn: {
      errorMessage: "email.or.sms",
      options: [["Email", "Sms"]]
    }
  }
};

module.exports = {
  Schema
};
