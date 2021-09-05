const fs = require("fs");

function writeToFile(fileName = "output.txt", content, flg = "a") {
  try {
    const data = fs.writeFileSync(fileName, content, { flag: flg });
  } catch (err) {
    console.error(err);
  }
}

exports.writeToFile = writeToFile;
