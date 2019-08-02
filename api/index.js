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
    console.log("==== code === ");
    console.log(code);
    const _user = findUser(users, code);
    console.log("==== found === ");
    console.log(_user);

    if (_user) return _user;

    return null;
  };

  const getMatches = () => [];

  return {
    getUser,
    getMatches
  };
})(users);

module.exports = API;
