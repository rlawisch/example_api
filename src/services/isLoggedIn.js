function isLoggedIn(req) {
  const userEmail = req.cookies.userEmail;

  return userEmail && userEmail != "";
}

module.exports = isLoggedIn;
