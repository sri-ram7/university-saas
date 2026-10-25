const HTTP_METHODS = new Set([
  "GET",
  "HEAD",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "TRACE",
  "CONNECT",
]);

const getSafeMethod = (method) =>
  HTTP_METHODS.has(method) ? method : "OTHER";

const getSafeRoute = (req) => {
  if (!req.route || typeof req.route.path !== "string") {
    return "unmatched";
  }

  const basePath = typeof req.baseUrl === "string" ? req.baseUrl : "";
  return `${basePath}${req.route.path}` || "/";
};

module.exports = {
  getSafeMethod,
  getSafeRoute,
};
