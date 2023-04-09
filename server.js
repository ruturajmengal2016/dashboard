require("dotenv").config();
const express = require("express");
const fs = require("fs");
const XLSX = require("xlsx");
const connection = require("./Config/connection");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header({
    "Access-Control-Allow-Origin": "https://nobelium-dashboard.onrender.com",
    "Access-Control-Allow-Origin": "*",
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

app.get("/users", (req, res) => {
  connection.query(`select * from users`, (error, result) => {
    if (error) {
      res.send(error);
    }
    res.send("get successfuuly");
  });
});

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
  } catch (error) {
    throw new Error("User not Found");
  }
});

app.post("/post", async (req, res) => {
  try {
    connection.query(
      `insert into users values (?,?,?)`,
      [req.body.id, req.body.name, req.body.email],
      (error, result) => {
        if (error) {
          console.log(error)
        }
       console.log("ok")
      }
    );
    res.status(201)
    res.send(`send successfully...`);
  } catch (error) {
    console.log(error)
  }
});

app.listen(process.env.PORT, () => {
  connection.connect((error) => {
    if (error) {
      console.error(error);
    }
    console.log("connected...");
  });
  console.log("server listening...");
});
