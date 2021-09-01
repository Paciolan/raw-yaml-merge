const yaml = require("yaml");

const getType = (node) =>
  yaml.isAlias(node) ? "ALIAS"
    : yaml.isDocument(node) ? "DOCUMENT"
    : yaml.isMap(node) ? "MAP"
    : yaml.isPair(node) ? "PAIR"
    : yaml.isScalar(node) ? "SCALAR"
    : yaml.isSeq(node) ? "SEQ"
    : yaml.isNode(node) ? "NODE"
    : "UNKNOWN"; // prettier-ignore

const mergeSingleItem = ({ mainNode, pair }) => {
  if (yaml.isScalar(mainNode.value) && yaml.isScalar(pair.value)) {
    // change SCALAR to SCALAR
    mainNode.value.value = pair.value.value;
  } else if (yaml.isSeq(mainNode.value) && yaml.isSeq(pair.value)) {
    // change SEQ to SEQ
    mainNode.value = pair.value;
  } else if (yaml.isAlias(mainNode.value) && yaml.isAlias(pair.value)) {
    // change ALIAS to ALIAS
    mainNode.value = pair.value;
  } else if (yaml.isScalar(mainNode.value) && yaml.isAlias(pair.value)) {
    // change SCALAR to ALIAS
    mainNode.value = pair.value;
  } else if (yaml.isAlias(mainNode.value) && yaml.isScalar(pair.value)) {
    // change ALIAS to SCALAR
    mainNode.value = pair.value;
  } else {
    const T1 = getType(pair.value);
    const T2 = getType(mainNode.value);
    throw new Error(`Cannot merge "${pair.key}" ${T1} into ${T2}`);
  }
};

const mergeItems = (mainItems, overrideItems) => {
  for (let pair of overrideItems) {
    const { key, value } = pair;
    const mainNode = mainItems.find((item) => item.key.value === key.value);

    if (yaml.isPair(mainNode)) {
      if (yaml.isMap(value)) {
        // Keep searching. Your princess is in another castle.
        mergeItems(mainNode.value.items, value.items);
      } else {
        mergeSingleItem({ mainNode, pair });
      }
    } else {
      // mainItems is missing Pair. Push override into mainItems.
      mainItems.push(pair);
    }
  }
};

const merge = (rawYaml, overrideYaml) => {
  const mainDoc = yaml.parseDocument(rawYaml);
  const overrideDoc = yaml.parseDocument(overrideYaml);

  mergeItems(mainDoc.contents.items, overrideDoc.contents.items);

  return yaml.stringify(mainDoc);
};

module.exports = {
  merge,
};
