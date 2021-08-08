let storage = [];

function createUser(email, passwordHash) {
  storage.push({
    email,
    passwordHash,
    balance: 0,
    accountNumber: generateAccountNumber(),
  });
}

function findUserByEmail(email) {
  return storage.find((user) => user.email === email);
}

function findUserByAccountNumber(accNo) {
  return storage.find((user) => user.accountNumber == accNo);
}

function deleteUser(email) {
  const userIndex = storage.findIndex((user) => user.email === email);
  storage.splice(userIndex, 1);
}

function depositIntoAccount(accountNumber, amount) {
  const userIndex = storage.findIndex(
    (user) => user.accountNumber == accountNumber
  );
  storage[userIndex].balance += amount;

  return storage[userIndex];
}

function withdrawFromAccount(accountNumber, amount) {
  const userIndex = storage.findIndex(
    (user) => user.accountNumber == accountNumber
  );

  if (storage[userIndex].balance < amount) return;

  storage[userIndex].balance -= amount;
  return storage[userIndex];
}

function generateAccountNumber() {
  do {
    accNo = Math.floor(Math.random() * 9999) + 1;
  } while (findUserByAccountNumber(accNo));

  return accNo;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserByAccountNumber,
  deleteUser,
  depositIntoAccount,
  withdrawFromAccount,
};
