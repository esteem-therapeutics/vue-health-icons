# vue-health-icons

[![NPM version](https://img.shields.io/npm/v/vue-health-icons.svg?style=flat)](https://npmjs.com/package/vue-health-icons) [![NPM downloads](https://img.shields.io/npm/dm/vue-health-icons.svg?style=flat)](https://npmjs.com/package/vue-health-icons)

## Install

```bash
yarn add vue-health-icons
```

## Usage

```js
// Only import what you need!
import { DevicesMaskOutlineIcon, PeopleElderlyFilledIcon, ... } from 'vue-health-icons';
```

A full list of icons is available at https://healthicons.org.

### Sizing

By default, icons will be sized based on the font size of the parent element.

You can set a custom size using the `size` attribute.
For multiple based sizing, pass the desired multiple followed by an `x`.

```html
<devices-mask-outline-icon size="1.5x" class="custom-class"></activity-icon>
```

You can also set a `px` size directly by just passing an integer

```html
<devices-mask-outline-icon size="25" class="custom-class"></activity-icon>
```

## Tree shaking

By using ES imports like `import { DevicesMaskOutlineIcon } from 'vue-health-icons';` with [webpack + minifier](https://webpack.js.org/guides/tree-shaking/#minify-the-output) or Rollup, unused exports in this module will be automatically eliminated.

To make webpack tree shaking work without using any minifier, you can use the per-file icons from this icons directory, e.g. `import DevicesMaskOutlineIcon from 'vue-health-icons/icons/DevicesMaskOutlineIcon';`.

## Related

This package is an adaptation of [vue-feather-icons](https://github.com/egoist/vue-bytesize-icons).
