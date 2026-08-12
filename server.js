// server.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
app.use(express.json());

// 定义一个极简的代理接口
app.post("/api/qwen", async (req, res) => {
  try {
    const response = await axios.post(
      "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
      {
        model: "qwen-turbo", // 你可以根据需要更换模型
        messages: req.body.messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    res.json(response.data);
  } catch (error) {
    console.error("千问API调用失败:", error.message);
    res.status(500).json({ error: "AI 服务暂时不可用" });
  }
});
app.use(express.static(path.join(__dirname)));
app.listen(3000, () => console.log("代理服务器已启动: http://localhost:3000"));
