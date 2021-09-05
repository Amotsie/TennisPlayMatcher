const express = require("express");
const path = require("path");
const matcher = require("./matcher");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/index.html"));
});

app.post("/match", (req, res) => {
  let name1 = req.body.player1;
  let name2 = req.body.player2;
  try {
    let score = matcher.findMatch(name1, name2);
    let result = "";
    if (score >= 80)
      result = `"${name1}" matches "${name2}" ${score}%, good match.`;
    else result = `"${name1}" matches "${name2}" ${score}%`;
    return res.send({
      status: 200,
      msg: result,
    });
  } catch (err) {
    return res.send({
      status: 500,
      msg: err.message,
    });
  }
});

app.listen(3000, () => console.log("Server started on Port 3000"));
