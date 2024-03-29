import fs from "fs";
import path from "path";
import archiver from "archiver";
import process from "process";
import { cleanOrCreateDirectory, copy, modes } from "./tools.js";

const installPath = process.argv?.[2];
const zipOrNot = () => {
  const value = process.argv?.[3];
  if (value === "false") {
    return false;
  }
  return true;
};
if (!installPath) {
  console.log("Please provide a path to the game's package file.");
  process.exit(1);
}

export const compressDirectory = (srcDirectory: string, dstZipFile: string) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(dstZipFile);
    const archive = archiver("zip", {
      zlib: { level: 0 }, // Level 0 means no compression
    });

    output.on("close", function () {
      console.log(archive.pointer() + " total bytes");
      console.log(
        "Archiver has been finalized and the output file descriptor has closed."
      );
      resolve(true);
    });

    archive.on("error", function (err) {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(srcDirectory, false);
    archive.finalize();
  });
};

for (const mode of modes) {
  const modeName = path.basename(mode);
  const modeInstallDir = path.join(installPath, modeName);
  const workshopInstallDir = path.join(installPath, "workshop");
  const workshopModeInstallDir = path.join(workshopInstallDir, modeName);
  const modeInstallZip = path.join(installPath, `${modeName}.zip`);
  const modeInstallScs = path.join(installPath, `${modeName}.scs`);
  cleanOrCreateDirectory(modeInstallDir);
  fs.rmSync(modeInstallZip, { recursive: true, force: true });
  fs.rmSync(modeInstallScs, { recursive: true, force: true });

  //create scs
  copy(path.join(mode, "default", "def"), path.join(modeInstallDir, "def"));
  copy(path.join(mode, "default", "manifest.sii"), modeInstallDir);
  copy(path.join(mode, "default", "mod_description.txt"), modeInstallDir);
  copy(path.join(mode, "default", "image.jpg"), modeInstallDir);

  if (zipOrNot()) {
    await compressDirectory(modeInstallDir, modeInstallZip);
    fs.renameSync(modeInstallZip, modeInstallScs);
  }
  //create workshop item
  cleanOrCreateDirectory(workshopModeInstallDir);
  copy(path.join(mode, "workshop"), path.join(workshopModeInstallDir), true);
  copy(
    path.join(modeInstallDir),
    path.join(workshopModeInstallDir, "default"),
    true
  );
  copy(
    path.join(mode, "image_steam.jpg"),
    path.join(workshopInstallDir, `${modeName}.jpg`)
  );

  if (zipOrNot()) {
    fs.rmSync(modeInstallDir, { recursive: true, force: true });
  }
}
