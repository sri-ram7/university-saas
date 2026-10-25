const bcrypt = require("bcrypt");

/**
 * Hash a plain text password using bcrypt
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

/**
 * Compare plain text password against hashed password
 */
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};