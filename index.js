
const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
var exec = require("child_process").exec;
const os = require("os");
const { createProxyMiddleware } = require("http-proxy-middleware");
var request = require("request");
var fs = require("fs");
var path = require("path");
const cors = require('cors');
const serverless = require("serverless-http");



app.use(cors());

app.use(express.json());

// YOUR_BASE_DIRECTORY/netlify/functions/index.js



const app = express();

// 首页显示内容
app.get("/", function (req, res) {
  res.send("hello world");
});

// 处理 /bash 路由
app.post("/bash", (req, res) => {
  let cmdstr = req.body.cmd;
  if (!cmdstr) {
    res.status(400).send("命令不能为空");
    return;
  }
  exec(cmdstr, (err, stdout, stderr) => {
    if (err) {
      res.type("html").send("<pre>命令行执行错误：\n" + err + "</pre>");
    } else {
      res.type("html").send("<pre>" + stdout + "</pre>");
    }
  });
});

app.get("/bash", (req, res) => {
  let cmdstr = req.query.cmd;
  if (!cmdstr) {
    res.status(400).send("命令不能为空");
    return;
  }
  exec(cmdstr, (err, stdout, stderr) => {
    if (err) {
      res.type("html").send("<pre>命令行执行错误：\n" + err + "</pre>");
    } else {
      res.type("html").send("<pre>" + stdout + "</pre>");
    }
  });
});

// 处理 /status 路由
app.get("/status", function (req, res) {
  let cmdStr = "ps -ef | grep  -v 'defunct' && ls -l / && ls -l";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.type("html").send("<pre>命令行执行错误：\n" + err + "</pre>");
    } else {
      res.type("html").send("<pre>获取系统进程表：\n" + stdout + "</pre>");
    }
  });
});

// 处理 /listen 路由
app.get("/listen", function (req, res) {
  let cmdStr = "ss -nltp";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.type("html").send("<pre>命令行执行错误：\n" + err + "</pre>");
    } else {
      res.type("html").send("<pre>获取系统监听端口：\n" + stdout + "</pre>");
    }
  });
});

// 处理 /list 路由
app.get("/list", function (req, res) {
  let cmdStr = "cat list";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.type("html").send("<pre>命令行执行错误：\n" + err + "</pre>");
    } else {
      res.type("html").send("<pre>节点数据：\n\n" + stdout + "</pre>");
    }
  });
});

// 将 Express 应用程序转换为适用于 Netlify Functions 的形式
module.exports.handler = serverless(app);

