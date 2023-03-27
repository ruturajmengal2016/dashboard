require("dotenv").config()
const express = require("express");
const XLSX = require("xlsx");
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header({"Access-Control-Allow-Origin": "*"});
  next();
}) 
const workbook = XLSX.readFile("./Excel/Nobelium - Leaderboard.xlsx");

const worksheet = workbook.Sheets["Sheet1"];
const data = XLSX.utils.sheet_to_json(worksheet);

const profile_data = [];
for (let value of data) {
  profile_data.push({
    Name: value["Student's Name"],
    Email: value["Email Id"],
    Roll_no: value["Roll No."],
    Mob: value["Mobile No."],
  });
}

app.get("/data", (req, res) => {
  res.send(profile_data);
});

app.listen(process.env.PORT, () => {
  console.log("server listening...");
});
