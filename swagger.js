const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const outputFile = "build/swagger_output.json";
const endpoints = ["src/routes.js"];

const docs = {
  info: {
    version: "1.0.0",
    title: "iXp Tech For Dummies / Tech For Techs example API",
    description:
      "A simple API for an ATM for you to explore ☺\n\nCreated with love by Rafael Lawisch and Vinícius Lora for the best internship experience ever ❤",
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Auth",
      description: "Log in and log out",
    },
    {
      name: "Account Operations",
      description:
        "Create and close account, see account overview and request other users' account number",
    },
    {
      name: "ATM Operations",
      description:
        "See account balance and make deposits, withdrawals and transfers",
    },
  ],
  securityDefinitions: {
    logged_in: {
      type: "apiKey",
      in: "cookie",
      name: "userEmail",
      description: "Needs to be logged in to access this route",
    },
  },
  definitions: {
    Login: {
      $email: "john.doe@test.com",
      $password: "123456",
    },
    Amount: {
      $amount: 1000.0,
    },
  },
};

swaggerAutogen(outputFile, endpoints, docs);
