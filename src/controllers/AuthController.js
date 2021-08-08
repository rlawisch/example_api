const bcrypt = require("bcryptjs");

const storage = require("../storage");
const isLoggedIn = require("../services/isLoggedIn");
const getSelfUser = require("../services/getSelfUser");

const cookieName = "userEmail";

function login(req, res) {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Logs into account'
  /* #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             $ref: "#/definitions/Login"
           }
         },
       }
     } */
  /* #swagger.responses[200] = {
       description: 'User successfully logged in'
    } */
  /* #swagger.responses[401] = {
       description: 'Invalid login details'
    } */
  /* #swagger.responses[403] = {
       description: 'Already logged in'
    } */
  if (isLoggedIn(req)) {
    return res.status(403).send({
      error: `Already logged in as user ${req.cookies.userEmail}`,
    });
  }

  const { email, password } = req.body;

  const user = storage.findUserByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).send({
      error: "Invalid login details",
    });
  }

  return res
    .status(200)
    .cookie(cookieName, email)
    .send({
      message: `User ${email} logged in successfully`,
    });
}

function logout(req, res) {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Logs out of the account'
  // #swagger.security = [{ "logged_in": [] }]
  /* #swagger.responses[200] = {
       description: 'User successfully logged out'
    } */
  /* #swagger.responses[401] = {
       description: 'Not logged in'
    } */
  if (!isLoggedIn(req)) {
    return res.status(401).send({
      error: "User is not logged in",
    });
  }

  return res
    .status(200)
    .clearCookie(cookieName)
    .send({
      message: `User ${req.cookies.userEmail} logged out successfully`,
    });
}

module.exports = {
  login,
  logout,
};
