import {
  modes,
  globalConfig,
  trucksPath,
  scanHorsePower,
  outputPath,
  copyEngine,
} from "./tools.js";
import type { ConfigGlobal, ConfigMode } from "./tools.js";
import fs from "fs";
import path from "path";

type Engine = {
  engine: string;
  hp: number;
  tkhp: number;
  unlock: number;
};
type TrucksMap = {
  truck: string;
  engines: Engine[];
}[];

const trucksMap = (): TrucksMap => {
  const trucks = fs
    .readdirSync(trucksPath(), { withFileTypes: true })
    .filter((dirent: fs.Dirent) => dirent.isDirectory())
    .map((dirent: fs.Dirent) => dirent.name);

  const engines = trucks.map((truck) => {
    const enginesPath = path.join(trucksPath(), truck, "engine");
    const engines = fs
      .readdirSync(enginesPath, { withFileTypes: true })
      .filter((dirent: fs.Dirent) => dirent.isFile())
      .map((dirent: fs.Dirent) => {
        const enginePath = path.join(enginesPath, dirent.name);
        const hp = scanHorsePower(fs.readFileSync(enginePath, "utf-8"));
        return { engine: dirent.name, hp, unlock: 0, tkhp: 0 };
      });

    return { truck, engines };
  });

  return engines;
};

const calculateUnlock = (
  trucksMap: TrucksMap,
  config: ConfigMode
): TrucksMap => {
  const findLowestHorsePower = (engines: Engine[]): number =>
    Math.min(...engines.map((engine) => engine.hp));
  const findHighestHorsePower = (engines: Engine[]): number =>
    Math.max(...engines.map((engine) => engine.hp));
  const findLowestTempKeyHorsePower = (trucksMap: TrucksMap): number =>
    Math.min(
      ...trucksMap.flatMap((truck) =>
        truck.engines.map((engine) => engine.tkhp)
      )
    );
  const findHighestTempKeyHorsePower = (trucksMap: TrucksMap): number =>
    Math.max(
      ...trucksMap.flatMap((truck) =>
        truck.engines.map((engine) => engine.tkhp)
      )
    );

  return trucksMap
    .map((truck) => {
      truck.engines.map((engine) => {
        const tkhp =
          Math.round(
            engine.hp +
              findLowestHorsePower(truck.engines) +
              findHighestHorsePower(truck.engines) * config.Multiplier
          ) +
          Math.max(engine.hp - findLowestHorsePower(truck.engines), 0) * 2;
        engine.tkhp = tkhp;
        return engine;
      });
      return truck;
    })
    .map((truck, _i, trucks) => {
      truck.engines.map((engine) => {
        engine.unlock =
          Math.round(
            ((engine.tkhp - findLowestTempKeyHorsePower(trucks)) /
              (findHighestTempKeyHorsePower(trucks) -
                findLowestTempKeyHorsePower(trucks))) *
              (config.LastLevelExpected - config.FirstLevelExpected)
          ) + config.FirstLevelExpected;
        return engine;
      });
      return truck;
    });
};

modes.map((mode: string) => {
  const modeName = path.basename(mode);
  console.info(`Mode: ${modeName}`);
  const modePath = mode;
  const modeConfigPath = path.join(modePath, "config.json");
  const modeConfig = JSON.parse(
    fs.readFileSync(modeConfigPath, "utf-8")
  ) as ConfigMode;
  if (!fs.existsSync(modeConfigPath)) {
    return;
  }

  fs.rmSync(outputPath(), { recursive: true, force: true });
  fs.rmSync(path.join(modePath, "default", "def", "vehicle", "truck"), {
    recursive: true,
    force: true,
  });

  const trucks = calculateUnlock(trucksMap(), modeConfig);
  trucks.map((truck) => {
    truck.engines.map((engine) => {
      const srcEnginePath = path.join(
        trucksPath(),
        truck.truck,
        "engine",
        engine.engine
      );

      copyEngine(
        srcEnginePath,
        path.join(
          modePath,
          "default",
          "def",
          "vehicle",
          "truck",
          truck.truck,
          "engine"
        ),
        engine.engine,
        engine.unlock
      );

      copyEngine(
        srcEnginePath,
        path.join(
          outputPath(),
          modeName,
          "def",
          "vehicle",
          "truck",
          truck.truck,
          "engine"
        ),
        engine.engine,
        engine.unlock
      );
    });
  });
});
