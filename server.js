require("dotenv").config();
const express = require("express");
const XLSX = require("xlsx");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header({
    "Access-Control-Allow-Origin": "https://nobelium-dashboard.onrender.com",
  });
  next();
});

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

app.get("/user/:id", async (req, res) => {
  try {
    let userProfile;
    for (let value of data) {
      if (value["Roll No."] == req.params.id) {
        userProfile = value;
      }
    }
    res.send(userProfile);
    res.end();
  } catch (error) {
    throw new Error("User not Found");
  }
});

app.listen(process.env.PORT, (error) => {
  if (error) {
    console.log(error);
  }
  console.log("server listening...");
});
