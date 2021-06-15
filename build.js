const path = require("path");
const pascalCase = require("pascal-case");
const fs = require("fs-extra");
const { optimize } = require("svgo");

const generateComponent = (name, svg) => {
  const outputSvg = optimize(svg, {
    plugins: ["removeDimensions", "removeUselessStrokeAndFill"],
  });

  return `
export default {
  name: '${name}',
  functional: true,
  props: {
    size: { type: Number, default: 24, required: false }
  },
  render(h, ctx) {
    const size = ctx.props.size + 'px';
    
    const attrs = ctx.data.attrs || {};
    attrs.width = attrs.width || size;
    attrs.height = attrs.height || size;
    ctx.data.attrs = attrs;
  
    return ${outputSvg.data
      .replace(/#333333/g, "currentColor")
      .replace(/<svg([^>]+)>/, "<svg$1 {...ctx.data}>")};
  }
}
`.trim();
};

async function getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files);
}

async function getIcons(style) {
  const filesPath = path.join(
    __dirname,
    `./node_modules/health-icons/public/icons/svg/`
  );
  const files = await getFiles(filesPath);
  ``;

  const icons = await Promise.all(
    files.map(async (filePath) => {
      const [style, category, iconName] = filePath
        .replace(filesPath, "")
        .replace(".svg", "")
        .split("/");

      const svg = await fs.readFile(filePath, "utf8");

      return { name: pascalCase(`${category}_${iconName}_${style}_icon`), svg };
    })
  );

  return icons;
}

async function main() {
  const icons = await getIcons();

  for (let i = 0; i < icons.length; i++) {
    const { name, svg } = icons[i];

    const component = generateComponent(name, svg);

    const filepath = `./src/components/${name}.js`;
    await fs.ensureDir(path.dirname(filepath));

    await fs.writeFile(filepath, component, "utf8");
  }

  const main = icons
    .map(
      (icon) =>
        `export { default as ${icon.name} } from '../icons/${icon.name}'`
    )
    .join("\n");
  await fs.outputFile("./src/index.js", main, "utf8");

  const types = `import Vue from 'vue';
import { ExtendedVue } from 'vue/types/vue';
export interface HealthIconProps {
  size: number;
}
export type HealthIconComponent = ExtendedVue<
  Vue,
  {},
  {},
  {},
  HealthIconProps
  >;
${icons
  .map((icon) => `export const ${icon.name}: HealthIconComponent;`)
  .join("\n")}`;
  await fs.outputFile("./index.d.ts", types, "utf8");
}
main();
