class ApiResponse {
  constructor(statusCode, param1, param2 = null) {
    this.success = typeof statusCode === 'boolean' ? statusCode : statusCode < 400;
    this.statusCode = typeof statusCode === 'boolean' ? (statusCode ? 200 : 400) : statusCode;

    // Detect parameter usage: (statusCode, message, data) vs (statusCode, data, message)
    if (typeof param1 === 'string' && (param2 === null || param2 === undefined || typeof param2 !== 'string')) {
      // param1 is message, param2 is data
      this.message = param1;
      this.data = param2;
    } else if (typeof param2 === 'string' && (param1 === null || param1 === undefined || typeof param1 !== 'string')) {
      // param1 is data, param2 is message
      this.message = param2;
      this.data = param1;
    } else {
      // Fallback/Default: param1 is message, param2 is data
      this.message = param1 || "Success";
      this.data = param2;
    }
  }
}

module.exports = ApiResponse;