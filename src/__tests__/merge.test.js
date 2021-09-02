const { merge } = require("../merge");

describe("merge.js", () => {
  test("changes the anchor", () => {
    const main = `
colors:
  primary: &primary-color "#444"
body:
  color: *primary-color`;
    const overrides = `
colors:
  primary: "orange"`;
    const expected = `colors:
  primary: &primary-color "orange"
body:
  color: *primary-color
`;
    const actual = merge(main, overrides);
    expect(actual).toBe(expected);
  });

  test("appends pair color.custom", () => {
    const main = `
colors:
  primary: &primary-color "#444"
body:
  color: *primary-color`;
    const overrides = `
colors:
  custom: pink`;
    const expected = `colors:
  primary: &primary-color "#444"
  custom: pink
body:
  color: *primary-color
`;
    const actual = merge(main, overrides);
    expect(actual).toBe(expected);
  });

  test("replaces SEQ", () => {
    const main = `array: [1, 2, 3]`;
    const overrides = `array: [4, 5, 6]`;
    const expected = `array: [ 4, 5, 6 ]
`;
    const actual = merge(main, overrides);
    expect(actual).toBe(expected);
  });

  test("override changes ALIAS", () => {
    const main = `
colors:
  primary: &primary-color "red"
  secondary: &secondary-color "orange"
box:
  color: *primary-color`;

    const overrides = `
box:
  color: *secondary-color`;

    const expected = `colors:
  primary: &primary-color "red"
  secondary: &secondary-color "orange"
box:
  color: *secondary-color
`;

    const merged = merge(main, overrides);
    expect(merged).toBe(expected);
  });

  test("override changes SCALAR to ALIAS", () => {
    const main = `
colors:
  primary: &primary-color "red"
box:
  color: pink`;
    const overrides = `
box:
  color: *primary-color`;
    const expected = `colors:
  primary: &primary-color "red"
box:
  color: *primary-color
`;
    const merged = merge(main, overrides);
    expect(merged).toBe(expected);
  });

  test("override changes ALIAS to SCALAR", () => {
    const main = `
colors:
  primary: &primary-color "red"
box:
  color: *primary-color`;
    const overrides = `
box:
  color: pink`;
    const expected = `colors:
  primary: &primary-color "red"
box:
  color: pink
`;
    const merged = merge(main, overrides);
    expect(merged).toBe(expected);
  });
});
