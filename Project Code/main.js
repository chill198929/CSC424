const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

// Requirements for local server to handle saving/loading
const express = require("express");
const exp = express();
exp.use(express.json());
const http = require("http").Server(exp);

// Configure listen port for socket connections
const server = http.listen(3000, () => {
  console.log("listening on *:3000");
});

// Get endpoint to pass settings to client
exp.get("/get", (req, res) => {
  res.json(JSON.parse(fs.readFileSync("settings.json")));
});

// Post endpoint to receive settings from client
exp.post("/post", (req, res) => {
  let data = {
    username: req.body.username,
    password: req.body.password,
    url: req.body.url,
    port: req.body.port,
  };
  fs.writeFileSync("settings.json", JSON.stringify(data));
  res = res.json();
});

function createWindow() {
  const win = new BrowserWindow({
    show: false,
    minWidth: 1000,
    minHeight: 1000,
    title: "DevOP",
  });
  win.maximize();
  win.show();
  win.loadFile("./client/index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

require("electron-reload")(__dirname, {
  electron: path.join(__dirname, "node_modules", ".bin", "electron"),
});
