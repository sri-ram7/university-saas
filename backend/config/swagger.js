const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerDocument = YAML.load("./docs/swagger.yaml");

module.exports = {
  swaggerUi,
  swaggerDocument,
};