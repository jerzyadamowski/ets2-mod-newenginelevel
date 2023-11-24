import fs from "fs";
import archiver from "archiver";
import process from "process";

const installPath = process.argv?.[2];
if (!installPath) {
  console.log("Please provide a path to the game's package file.");
  process.exit(1);
}

export const compressDirectory = (srcDirectory: string, dstZipFile: string) => {
  const output = fs.createWriteStream(dstZipFile);
  const archive = archiver("zip", {
    zlib: { level: 0 }, // Level 0 means no compression
  });

  output.on("close", function () {
    console.log(archive.pointer() + " total bytes");
    console.log(
      "Archiver has been finalized and the output file descriptor has closed."
    );
  });

  archive.on("error", function (err) {
    throw err;
  });

  archive.pipe(output);
  archive.directory(srcDirectory, false);
  archive.finalize();
};
