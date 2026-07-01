const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
// require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  fs.readdir(`./hisaab`, (err, files) => {
    if (err) return res.status(500).send(err);

    res.render("index", { files: files });
  });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.get("/edit/:filename", (req, res) => {
  fs.readFile(`./hisaab/${req.params.filename}`, "utf-8", (err, filedata) => {
    if (err) return res.status(500).send(err);
    res.render("edit", { filedata, filename: req.params.filename });
  });
});

app.get("/hisaab/:filename", (req, res) => {
  fs.readFile(`./hisaab/${req.params.filename}`, "utf-8", (err, filedata) => {
    if (err) return res.status(500).send(err);
    res.render("hisaab", { filedata, filename: req.params.filename });
  });
});

app.get("/delete/:filename", (req, res) => {
  fs.unlink(`./hisaab/${req.params.filename}`, function (err) {
    if (err) return res.send(err);
    res.redirect("/");
  });
});

app.post("/update/:filename", (req, res) => {
  fs.writeFile(`./hisaab/${req.params.filename}`, req.body.content, (err) => {
    if (err) return res.status(500).send(err);
    res.redirect("/");
  });
});

app.post("/createhisaab", (req, res) => {
  const currentDate = new Date();
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1; // Months are zero-based in JavaScript
  let year = currentDate.getFullYear();

  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  const fn = `${day}-${month}-${year}`;

  //var date = `${currentDate.getDate()}-${currentDate.getMonth()+1}-${currentDate.getFullYear()}`;

  fs.writeFile(`./hisaab/${fn}.txt`, req.body.content, (err) => {
    if (err) return res.status(500).send(err);
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
