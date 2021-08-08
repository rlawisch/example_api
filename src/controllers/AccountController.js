const bcrypt = require("bcryptjs");

const storage = require("../storage");
const isLoggedIn = require("../services/isLoggedIn");
const getSelfUser = require("../services/getSelfUser");
const validateEmail = require("../services/validateEmail");

const cookieName = "userEmail";

function createAccount(req, res) {
  // #swagger.tags = ['Account Operations']
  // #swagger.summary = 'Creates an account'
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
  if (isLoggedIn(req)) {
    return res.status(403).send({
      error: `Already logged in as user ${req.cookies.userEmail}`,
    });
  }

  const { email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).send({
      error: `${email} is not a valid e-mail address`,
    });
  }

  if (storage.findUserByEmail(email)) {
    return res.status(400).send({
      error: `Email ${email} is already registered`,
    });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  storage.createUser(email, passwordHash);

  return res
    .status(201)
    .cookie(cookieName, email)
    .send({
      message: `User ${email} registered successfully`,
    });
}

function getOtherUser(req, res) {
  // #swagger.tags = ['Account Operations']
  // #swagger.summary = "Finds other users' account number"
  /* #swagger.parameters['email'] = {
       in: 'path',
       description: 'Other user\'s e-mail',
       required: true,
       example: 'jane.doe@test.com'
     } */
  const { email } = req.params;

  const user = storage.findUserByEmail(email);
  if (!user) {
    return res.status(404).send({
      error: `No user found with email ${email}`,
    });
  }

  return res.status(200).send({
    email,
    accountNumber: user.accountNumber,
  });
}

function getUser(req, res) {
  // #swagger.tags = ['Account Operations']
  // #swagger.summary = 'Shows your account overview'
  // #swagger.security = [{ "logged_in": [] }]
  const user = getSelfUser(req);

  if (!user) {
    return res.status(401).send({
      error: "User must be logged in to get full account information",
    });
  }

  return res.status(200).send({
    email: user.email,
    accountNumber: user.accountNumber,
    balance: user.balance,
  });
}

function closeAccount(req, res) {
  // #swagger.tags = ['Account Operations']
  // #swagger.summary = 'Closes your account'
  // #swagger.security = [{ "logged_in": [] }]
  const user = getSelfUser(req);

  if (!user) {
    return res.status(401).send({
      error: "User must be logged in to close account",
    });
  }

  if (user.balance != 0) {
    return res.status(403).send({
      error:
        "All values must be withdrawn/transferred before deleting your account",
    });
  }

  storage.deleteUser(user.email);

  return res.status(204).clearCookie("userEmail").send();
}

module.exports = {
  createAccount,
  getOtherUser,
  getUser,
  closeAccount,
};
