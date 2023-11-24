import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const globalConfig = (): {} => {
  const configPath = path.resolve(__dirname, "../config.json");
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
};

export const modesPath = () => path.resolve(__dirname, "../mode");
export const trucksPath = () => path.resolve(__dirname, "./def/vehicle/truck");
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

export interface ConfigGlobal {}

export interface ConfigMode {
  FirstLevelExpected: number;
  LastLevelExpected: number;
  Multiplier: number;
}
