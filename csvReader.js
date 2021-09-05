const csv = require("csv-parser");
const fs = require("fs");
const matcher = require("./matcher");
const fileWriter = require("./fileWriter");

function readcsv(fileName = "data.csv") {
  const results = [];
  let males = [];
  let females = [];

  //Check if csv is provided
  if (!fs.existsSync("./" + fileName)) {
    console.log("data.csv NOT FOUND");
    console.log(
      "Please provide a CSV file with the name data.csv on the root directory."
    );
    return;
  }

  try {
    fs.createReadStream(fileName)
      .pipe(csv(["name", "gender"]))
      .on("data", (data) => {
        if (Object.keys(data).length === 0) return;
        if (Object.keys(data).length != 2) {
          console.log("Invalid input format line", data);
          let ErrMsg = `
  ${new Date().toDateString()} @ ${new Date().toLocaleTimeString()} [CSV File read]
  The following is ommited:
  ${JSON.stringify(data, null, 2)}
  "Invalid input format line"\n`;
          fileWriter.writeToFile("logs.txt", ErrMsg, "a");
          return;
        }
        data = {
          name: data.name.toLowerCase().trim(),
          gender: data.gender.toLowerCase().trim(),
        };
        if (!onlyLetter(data.name) || !onlyLetter(data.gender)) {
          console.log("Invalid input, Only letters A-Z allowed", data);
          let ErrMsg = `
  ${new Date().toDateString()} @ ${new Date().toLocaleTimeString()} [CSV File read]
  The following is ommited:
  ${JSON.stringify(data, null, 2)}
  "Invalid input, Only letters A-Z allowed."\n`;
          fileWriter.writeToFile("logs.txt", ErrMsg, "a");
          return;
        }
        if (
          data.gender.length != 1 &&
          (data.gender !== "m" || data.gender !== "f")
        ) {
          console.log("Invalid gender specification", data);
          let ErrMsg = `
  ${new Date().toDateString()} @ ${new Date().toLocaleTimeString()} [CSV File read]
  The following is ommited:
  ${JSON.stringify(data, null, 2)}
  "Invalid gender specification."\n`;
          fileWriter.writeToFile("logs.txt", ErrMsg, "a");
          return;
        }
        results.push(data);
      })
      .on("end", () => {
        results.forEach((person) => {
          if (person.gender == "m") {
            if (!males.includes(person.name)) males.push(person.name);
          } else {
            if (!females.includes(person.name)) females.push(person.name);
          }
        });
        console.log("Males", males, "Females", females);
        runMatches(males, females);
      });
  } catch (err) {
    console.log(err);
  }
}

function runMatches(m, f) {
  let preliminary = [];
  if (m.length == 0 || f.length == 0) {
    console.log("Empty inputs", m, f);
    let ErrMsg = `
  ${new Date().toDateString()} @ ${new Date().toLocaleTimeString()} [CSV File read]
  Males: ${m}
  Females: ${f}
  "cannot run compare function, males or females list empty."\n`;
    fileWriter.writeToFile("logs.txt", ErrMsg, "a");
    return;
  }
  m.forEach((male) => {
    for (let female of f) {
      let res = matcher.findMatch(male, female);
      preliminary.push({
        name1: male,
        name2: female,
        score: res,
      });
    }
  });
  preliminary.sort(compareScore);
  preliminary.sort(compareNames);
  console.log(preliminary);
  let final = preliminary.map((line) => {
    if (line.score >= 80)
      return `"${line.name1}" matches "${line.name2} ${line.score}%", good match.\n`;
    else return `"${line.name1}" matches "${line.name2} ${line.score}%".\n`;
  });
  let msg = `
${new Date().toDateString()} @ ${new Date().toLocaleTimeString()} [CSV File read]

Males: ${m}
Females: ${f}

${final.join("")}
----------------------------------------------------------------------------------`;
  fileWriter.writeToFile("output.txt", msg, "a");
}

function compareScore(a, b) {
  return b.score - a.score;
}

function compareNames(a, b) {
  if (a.score !== b.score) return 0;
  return a.name1.localeCompare(b.name1);
}

function onlyLetter(inputtxt) {
  var letters = /^[A-Za-z]+$/;
  if (inputtxt.match(letters)) {
    return true;
  } else {
    return false;
  }
}

readcsv();
