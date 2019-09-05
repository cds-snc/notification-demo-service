const Schema = {
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

module.exports = {
  Schema
};