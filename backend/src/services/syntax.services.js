const validator = require("validator");

const isValidSyntax = email => validator.isEmail(email);

module.exports = isValidSyntax;
