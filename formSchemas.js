const API = require("./api");
const isValidDate = require("./utils/").isValidDate;
const currencySchema = (errorMessageString = "errors.currency") => {
  return {
    isCurrency: {
      errorMessage: errorMessageString,
      options: { allow_negatives: false }
    }
  };
};

const yesNoSchema = (errorMessageString = "errors.yesNo") => {
  return {
    isIn: {
      errorMessage: errorMessageString,
      options: [["Yes", "No"]]
    }
  };
};

/**
 * Runs an array of validators over a value
 * this is a workaround I found to allow multiple custom validators
 * but still maintain individual error messages
 */
const validationArray = validators => {
  let errors = [];

  return {
    custom: {
      errorMessage: () => {
        return errors.length ? errors[0] : "value is invalid";
      },
      options: (value, { req }, opts) => {
        errors = [];
        const results = validators.map(validator => {
          const result = validator.validate(value, req, opts);
          // If validation failed set current Error
          if (result === false) {
            const errorMessage =
              validator.errorMessage || `${value} is invalid`;
            errors.push(errorMessage);
          }
          return result;
        });
        return results.every(value => value === true);
      }
    }
  };
};

const loginSchema = {
  code: {
    isLength: {
      errorMessage: "errors.login.length",
      options: { min: 9, max: 9 }
    },
    isAlphanumeric: {
      errorMessage: "errors.login.alphanumeric"
    },
    customSanitizer: {
      options: value => {
        return value ? value.toUpperCase() : value;
      }
    }
  }
};

const emailSchema = {
  email: {
    isLength: {
      errorMessage: "errors.email.length",
      options: { min: 3, max: 200 }
    }
  }
};

const nameSchema = {
  fullname: {
    isLength: {
      errorMessage: "errors.fullname.length",
      options: { min: 3, max: 200 }
    }
  },
  email: {
    isLength: {
      errorMessage: "errors.email.length",
      options: { min: 3, max: 200 }
    }
  },
  expiry: {
    customSanitizer: {
      options: value => {
        //We want to remove any spaces, dash or underscores
        return value ? value.replace(/[_]*/g, "") : value;
      }
    },
    custom: {
      options: (value, { req }) => {
        return isValidDate(value);
      },
      errorMessage: "errors.expiry.date"
    }
  },
  confirm: yesNoSchema()
};

const reviewSchema = {
  review: {
    isIn: {
      errorMessage: "errors.review",
      options: [["review"]]
    }
  }
};

const authSchema = {
  auth: currencySchema()
};

module.exports = {
  emailSchema,
  loginSchema,
  currencySchema,
  reviewSchema,
  authSchema,
  nameSchema
};
