# Raw YAML Merge

Merge YAML files while preserving anchors and aliases.

## The Problem

The merging of YAML files typically happens after both files have been converted to JSON.

The conversion of JSON processes the anchor and aliases.

Example Problem:

```yaml
# main.yaml
colors:
  primary: &primary-color "black"

body:
  color: *primary-color
```

```yaml
# overrides.yaml
colors:
  primary: "orange"
```

Expected output is incorrect because `body.color` was not replaced (expected to be `"orange"`), but remained `"black"`.

```yaml
# failed-output.yaml
colors:
  primary: "orange"

body:
  color: "black"
```

## The Solution

The solution is to merge the YAML files before converting them into JSON using an AST.

Expected output should match this:

```yaml
# success-output.yaml
colors:
  primary: "orange"

body:
  color: "orange"
```

## Install

```bash
npm install @paciolan/raw-yaml-merge
```

## Code

```javascript
const merge = require("@paciolan/raw-yaml-merge");

const mainYaml = `
colors:
  primary: &primary-color "black"
body:
  color: *primary-color
`;

const overrideYaml = `
colors:
  primary: "orange"
`;

const output = merge(mainYaml, overrideYaml);

console.log(output);
// colors:
//   primary: orange
// body:
//   color: orange
```

## Merge Types Supported

The types must be compatible. For example you wouldn't change an array (SEQ) into a string (SCALAR).

- SEQ to SEQ
- SCALAR to SCALAR
- ALIAS to ALIAS
- SCALAR to ALIAS
- ALIAS to SCALAR

In the event an incompatible type is merged, the merge will throw an Exception:

```
Error: Cannot merge "${KEY}" ${TYPE} into ${TYPE}
```
