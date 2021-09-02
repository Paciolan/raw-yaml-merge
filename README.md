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

```javascript
const { merge, parse } = require("@paciolan/raw-yaml-merge");
const fs = require("fs");

const main = fs.readFileSync(`${__dirname}/main.yml`, "utf8");
const overrides = fs.readFileSync(`${__dirname}/overrides.yml`, "utf8");

const merged = merge(main, overrides);
const output = parse(merged);

fs.writeFileSync(`${__dirname}/merged.yml`, merged);
fs.writeFileSync(`${__dirname}/output.yml`, output);
```

```yaml
# merged.yml
colors:
  primary: &primary-color "orange"
body:
  color: *primary-color
```

```yaml
# output.yml
colors:
  primary: orange
body:
  color: orange
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

## Options

An options object is passed through to the YAML.parseDocument method. Refer to the [yaml documentation](https://eemeli.org/yaml/#yaml) for options more details.

```javascript
const options = {
  maxAliasAcount: 10000,
};

const merged = merge(main, overrides, options);
const output = parse(merged, options);
```
