const fileWriter = require("./fileWriter");

const countOccurrences = (arr, val) =>
  arr.reduce((tot, v) => (v === val ? tot + 1 : tot), 0);

const convertToNumbers = (name1, name2) => {
  let phrase =
    `${name1.toLocaleLowerCase()}matches${name2.toLocaleLowerCase()}`.split("");

  let uniqueChars = [...new Set(phrase)];

  let numbers = "";

  for (const letter of uniqueChars) {
    numbers = numbers + countOccurrences(phrase, letter);
  }
  return numbers;
};

const sumUp = (numbers) => {
  const len = numbers.length;
  let start = 0;
  let end = len - 1;
  let stop = Math.floor(len / 2) - 1;
  let middle = Math.floor(len / 2);
  let sum = "";

  console.log(numbers.join(" "));
  while (start <= stop) {
    sum = sum + (parseInt(numbers[start]) + parseInt(numbers[end]));
    start++;
    end--;
  }
  if (len % 2 !== 0) {
    console.log(" ");
    return sum + "" + numbers[middle];
  }
  console.log(" ");
  return sum + "";
};

function findMatch(name1, name2) {
  if (typeof name1 !== "string" || typeof name2 !== "string")
    return "Invalid inputs";

  console.log(`Checking "${name1}" VS "${name2}"`);

  let letterCount = convertToNumbers(name1, name2);
  let total = sumUp(letterCount.split(""));
  while (total.length > 2) {
    total = sumUp(total.split(""));
  }
  if (parseInt(total) >= 80) {
    console.log(`"${name1}" matches "${name2}" ${total}%, good match.`);
    console.log("-------------------------------------------");
    return parseInt(total);
  } else {
    console.log(`"${name1}" matches "${name2}" ${total}%`);
    console.log("-------------------------------------------");
    return parseInt(total);
  }
}

exports.findMatch = findMatch;
