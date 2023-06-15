const escalate = require("./utils/escalate");
const base = require('./utils/base');

module.exports = escalate(base, 'error');
