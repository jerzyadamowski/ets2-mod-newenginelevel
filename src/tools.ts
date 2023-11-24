import fs from "fs";
import fse from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const globalConfig = (): {} => {
  const configPath = path.resolve(__dirname, "..", "config.json");
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
};

export const modesPath = () => path.resolve(__dirname, "..", "mode");
export const modes = fs
  .readdirSync(modesPath(), { withFileTypes: true })
  .filter((dirent: fs.Dirent) => dirent.isDirectory())
  .map((dirent: fs.Dirent) => path.join(modesPath(), dirent.name));

export const outputPath = () => path.resolve(__dirname, "..", "out");
export const trucksPath = () =>
  path.resolve(__dirname, "def", "vehicle", "truck");
export const scanHorsePower = (text: string) => {
  const regex = /info\[\]:\s*"(\d+)\s*@@hp@@/;
  const match = text.match(regex);
  if (match) {
    const value = match[1];
    return Number(value);
  } else {
    return 0;
  }
};
export const replaceUnlockLevel = (
  path: string,
  level: number,
  dstPath: string
) => {
  const text = fs.readFileSync(path, "utf-8");
  const regex = /(unlock:\s*)\d+/;
  const newText = text.replace(regex, `$1${level}`);
  fs.writeFileSync(dstPath, newText);
};
export const copyEngine = (
  src: string,
  dst: string,
  engine: string,
  level: number
) => {
  if (!fs.existsSync(dst)) {
    fs.mkdirSync(dst, { recursive: true });
  }

  const dstEnginePath = path.join(dst, engine);

  replaceUnlockLevel(src, level, dstEnginePath);
};

export const cleanOrCreateDirectory = (dirPath: string) => {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    fs.mkdirSync(dirPath, { recursive: true });
  } else {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const copy = (
  srcPath: string,
  dstPath: string,
  copyContentsOnly = false
) => {
  if (fs.lstatSync(srcPath).isDirectory()) {
    // if (fs.existsSync(dstPath)) {
    //   fs.mkdirSync(dstPath, { recursive: true });
    // }
    if (copyContentsOnly) {
      const files = fs.readdirSync(srcPath);
      files.forEach((file) => {
        const srcFilePath = path.join(srcPath, file);
        const dstFilePath = path.join(dstPath, file);
        fse.copySync(srcFilePath, dstFilePath);
      });
    } else {
      fse.copySync(srcPath, dstPath);
    }
  } else {
    if (fs.existsSync(dstPath) && fs.lstatSync(dstPath).isDirectory()) {
      dstPath = path.join(dstPath, path.basename(srcPath));
    }
    fs.copyFileSync(srcPath, dstPath);
  }
};

export interface ConfigGlobal {}

export interface ConfigMode {
  FirstLevelExpected: number;
  LastLevelExpected: number;
  Multiplier: number;
}
