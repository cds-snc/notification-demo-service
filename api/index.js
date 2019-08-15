const users = require("./users.json");

const findUser = (users, code) => {
  const result = users.filter(user => {
    if (code === user.login.code) {
      return true;
    }
  });

  if (result.length >= 1) {
    return result[0];
  }
};

var API = (function(users) {
  const getUser = code => {
    const _user = findUser(users, code);

    if (_user) return _user;

    return null;
  };

  return {
    getUser
  };
})(users);

module.exports = API;
