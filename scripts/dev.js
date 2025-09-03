// 这个文件是用来打包packages下的模块

import minimist from "minimist";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import esbuild from "esbuild";

const args = minimist(process.argv.slice(2));

const __fileName = fileURLToPath(import.meta.url); // 获取当前文件的绝对路径
const __dirname = dirname(__fileName); // 获取当前文件所在目录的绝对路径
const require = createRequire(import.meta.url); // 创建一个require函数
const target = args._.length ? args._[0] : "reactivity";
const format = args.f || "global";

// 入口文件
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`);
const pkg = require(`../packages/${target}/package.json`);

// 打包
esbuild
  .context({
    entryPoints: [entry],
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
    bundle: true,
    platform: "browser",
    sourcemap: true,
    format,
    globalName: pkg.buildOptions?.name || "", // 打包后的全局变量名字
  })
  .then((ctx) => {
    return ctx.watch();
  });
