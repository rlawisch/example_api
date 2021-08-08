const express = require("express");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");

const swaggerDocument = require("../build/swagger_output.json");
const router = require("./routes");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/", router);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, () => {
  console.log("API up and running at http://localhost:3000");
  console.log("See API documentation at http://localhost:3000/docs");
});
