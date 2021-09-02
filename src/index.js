const YAML = require("yaml");
const merge = require("./merge");

module.exports = {
  merge,
  parse: YAML.parse,
};
