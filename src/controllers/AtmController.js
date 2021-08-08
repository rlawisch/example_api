const storage = require("../storage");
const isLoggedIn = require("../services/isLoggedIn");
const getSelfUser = require("../services/getSelfUser");

function balance(req, res) {
  // #swagger.tags = ['ATM Operations']
  // #swagger.summary = 'Shows your balance'
  // #swagger.security = [{ "logged_in": [] }]
  const user = getSelfUser(req);

  if (!user) {
    return res.status(401).send({
      error: "User must be logged in to see account balance",
    });
  }

  return res.status(200).send({
    accountNumber: user.accountNumber,
    balance: user.balance,
  });
}

function deposit(req, res) {
  // #swagger.tags = ['ATM Operations']
  // #swagger.summary = 'Makes a deposit to specified account'
  /* #swagger.parameters['accountNumber'] = {
       in: 'path',
       description: 'Account number to deposit',
       required: true,
       example: '1337'
    } */
  /*	#swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/definitions/Amount"
            }
          },
        }
    } */
  const { accountNumber } = req.params;
  const { amount } = req.body;

  const user = storage.findUserByAccountNumber(accountNumber);

  if (!user) {
    return res.status(404).send({
      error: `Account number ${accountNumber} not found`,
    });
  }

  const updatedUser = storage.depositIntoAccount(accountNumber, amount);
  return res.status(200).send({
    message: `Successfully deposited ${amount} into account ${accountNumber}`,
  });
}

function depositToSelf(req, res) {
  // #swagger.tags = ['ATM Operations']
  // #swagger.summary = 'Makes a deposit to your account'
  // #swagger.security = [{ "logged_in": [] }]
  /*	#swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/definitions/Amount"
            }
          },
        }
    } */
  const user = getSelfUser(req);

  if (!user) {
    return res.status(401).send({
      error:
        "User must be logged in to deposit without providing account number",
    });
  }

  const { amount } = req.body;

  const updatedUser = storage.depositIntoAccount(user.accountNumber, amount);
  return res.status(200).send({
    accountNumber: updatedUser.accountNumber,
    balance: updatedUser.balance,
  });
}

function withdraw(req, res) {
  // #swagger.tags = ['ATM Operations']
  // #swagger.summary = 'Withdraws from your account'
  // #swagger.security = [{ "logged_in": [] }]
  /*	#swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/definitions/Amount"
            }
          },
        }
    } */
  const user = getSelfUser(req);

  if (!user) {
    return res.status(401).send({
      error: "User must be logged in to withdraw from account",
    });
  }

  const { amount } = req.body;

  const updatedUser = storage.withdrawFromAccount(user.accountNumber, amount);

  if (!updatedUser) {
    return res.status(401).send({
      error: "User balance is not enough to withdraw this amount",
    });
  }

  return res.status(200).send({
    accountNumber: updatedUser.accountNumber,
    balance: updatedUser.balance,
  });
}

function transfer(req, res) {
  // #swagger.tags = ['ATM Operations']
  // #swagger.summary = 'Transfers from your account to specified account'
  // #swagger.security = [{ "logged_in": [] }]
  /* #swagger.parameters['accountNumber'] = {
       in: 'path',
       description: 'Account number to transfer',
       required: true,
       example: '1337'
    } */
  /*	#swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/definitions/Amount"
            }
          },
        }
    } */
  const user = getSelfUser(req);

  if (!user) {
    return res.status(401).send({
      error: "User must be logged in to transfer from account",
    });
  }

  const { accountNumber } = req.params;
  const destinationUser = storage.findUserByAccountNumber(accountNumber);

  if (!destinationUser) {
    return res.status(404).send({
      error: `Account number ${accountNumber} not found`,
    });
  }

  const { amount } = req.body;

  const updatedUser = storage.withdrawFromAccount(user.accountNumber, amount);

  if (!updatedUser) {
    return res.status(401).send({
      error: "User balance is not enough to withdraw this amount",
    });
  }

  const updatedDestinationUser = storage.depositIntoAccount(
    accountNumber,
    amount
  );

  return res.status(200).send({
    accountNumber: updatedUser.accountNumber,
    balance: updatedUser.balance,
  });
}

module.exports = {
  balance,
  deposit,
  depositToSelf,
  withdraw,
  transfer,
};
