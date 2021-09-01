const yaml = require("yaml");
const { getType } = require("./lib/getType");

const mergeSingleItem = ({ main, override }) => {
  const mainType = getType(override.value);
  const overrideType = getType(main.value);

  if (mainType === "SCALAR" && overrideType === "SCALAR") {
    main.value.value = override.value.value;
  } else if (mainType === "SEQ" && overrideType === "SEQ") {
    main.value = override.value;
  } else if (mainType === "ALIAS" && overrideType === "ALIAS") {
    main.value = override.value;
  } else if (mainType === "ALIAS" && overrideType === "SCALAR") {
    main.value = override.value;
  } else if (mainType === "SCALAR" && overrideType === "ALIAS") {
    main.value = override.value;
  } else {
    throw new Error(`Cannot merge "${override.key}" ${mainType} into ${overrideType}`);
  }
};

const mergeItems = (mainItems, overrideItems) => {
  for (let override of overrideItems) {
    const main = mainItems.find((item) => item.key.value === override.key.value);

    if (yaml.isPair(main)) {
      if (yaml.isMap(override.value)) {
        // Keep searching. Your princess is in another castle.
        mergeItems(main.value.items, override.value.items);
      } else {
        mergeSingleItem({ main, override });
      }
    } else {
      // mainItems is missing Pair. Push override into mainItems.
      mainItems.push(override);
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
