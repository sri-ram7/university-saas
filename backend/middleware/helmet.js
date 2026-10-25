const helmet = require("helmet");

const createHelmetMiddleware = (allowSwaggerInlineResources = false) =>
  helmet({
    contentSecurityPolicy: {
      directives: {
        scriptSrc: allowSwaggerInlineResources
          ? ["'self'", "'unsafe-inline'"]
          : ["'self'"],
        styleSrc: allowSwaggerInlineResources
          ? ["'self'", "'unsafe-inline'"]
          : ["'self'"],
        upgradeInsecureRequests: null,
      },
    },
    // Docker and the included Nginx configuration currently serve HTTP only.
    hsts: false,
  });

const apiHelmet = createHelmetMiddleware();
const swaggerHelmet = createHelmetMiddleware(true);

module.exports = (req, res, next) => {
  const requestPath = (req.originalUrl || req.url).split("?")[0];
  const isSwaggerRequest =
    requestPath === "/api/docs" || requestPath.startsWith("/api/docs/");

  return (isSwaggerRequest ? swaggerHelmet : apiHelmet)(req, res, next);
};