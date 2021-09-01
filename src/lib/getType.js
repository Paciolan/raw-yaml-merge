const yaml = require("yaml");

const getType = (node) =>
  yaml.isAlias(node) ? "ALIAS"
    : yaml.isMap(node) ? "MAP"
    : yaml.isPair(node) ? "PAIR"
    : yaml.isScalar(node) ? "SCALAR"
    : yaml.isSeq(node) ? "SEQ"
    : "UNKNOWN"; // prettier-ignore

module.exports = {
  getType,
};
