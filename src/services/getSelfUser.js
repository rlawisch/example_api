const storage = require("../storage");

const isLoggedIn = require("./isLoggedIn");

function getSelfUser(req) {
  if (!isLoggedIn(req)) return;

  return storage.findUserByEmail(req.cookies.userEmail);
}

module.exports = getSelfUser;
