const isValidDate = require("../../utils/").isValidDate;
const isEmail = require("validator/lib/isEmail");
const isMobilePhone = require("validator/lib/isMobilePhone").default;

const Schema = {
  fullname: {
    isLength: {
      errorMessage: "errors.fullname.length",
      options: { min: 3, max: 200 }
    }
  },
  phone: {
    custom: {
      options: (value, { req }) => {
        if (typeof req.body.phone !== "undefined") {
          return isMobilePhone(req.body.phone);
        }

        return true;
      },
      errorMessage: "phone.length"
    }
  },
  email: {
    custom: {
      options: (value, { req }) => {
        if (typeof req.body.email !== "undefined") {
          return isEmail(req.body.email);
        }

        return true;
      },
      errorMessage: "email.length"
    }
  },
  expiry: {
    customSanitizer: {
      options: value => {
        //We want to remove any spaces, dash or underscores
        return value ? value.replace(/[_]*/g, "") : value;
      },
      errorMessage: "errors.expiry.date.format"
    },
    custom: {
      options: (value, { req }) => {
        return isValidDate(value);
      },
      errorMessage: "errors.expiry.date"
    }
  }
};

module.exports = {
  Schema
};
