const express = require("express");

const router = express.Router();

const {
  swaggerUi,
  swaggerDocument,
} = require("../config/swagger");

router.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

module.exports = router;