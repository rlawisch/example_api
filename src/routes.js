const express = require("express");

const AuthController = require("./controllers/AuthController");
const AccountController = require("./controllers/AccountController");
const AtmController = require("./controllers/AtmController");

const router = express.Router();

// Auth Routes
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

// Account Routes
router.get("/user/:email", AccountController.getOtherUser);
router.get("/user", AccountController.getUser);
router.post("/user", AccountController.createAccount);
router.delete("/user", AccountController.closeAccount);

// ATM Routes
router.get("/balance", AtmController.balance);
router.post("/deposit/:accountNumber", AtmController.deposit);
router.post("/deposit", AtmController.depositToSelf);
router.post("/withdraw", AtmController.withdraw);
router.post("/transfer/:accountNumber", AtmController.transfer);

module.exports = router;
