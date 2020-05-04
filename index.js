const SHEET_ID = "1fULzAdOs-BwxxjxDIUbqEV_-wMOBdXn5f-SHw2IV5CE";
const SHEET_NAME = "test";

function getSheetData() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  return data.map(function (row) { return { key: row[0], value: row[1], type: row[2] }; });
}

const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const line = require("@line/bot-sdk");
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY
};
const client = new line.Client(config);

express()
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .get("/g/", (req, res) => res.json({ method: "こんにちは、getさん" }))
  .post("/p/", (req, res) => res.json({ method: "こんにちは、postさん" }))
  .post("/hook/", line.middleware(config), (req, res) => lineBot(req, res))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

function lineBot(req, res) {
  res.status(200).end();
  // ここから追加
  const events = req.body.events;
  const promises = [];
  for (let i = 0, l = events.length; i < l; i++) {
    const ev = events[i];
    promises.push(
      echoman(ev),
      getmenu(ev)
    );
  }
  Promise.all(promises).then(console.log("pass"));
}

// 追加
async function echoman(ev) {
  const pro = await client.getProfile(ev.source.userId);
  var reply_text = getSheetData();
  return client.replyMessage(ev.replyToken, {
    type: "text",
    text: `${pro.displayName}さん、今「${ev.message.text}」って言いました？`
  })
}

async function getmenu(ev) {
  return client.replyMessage(ev.replyToken, {
    type: "template",
    altText: "this is a buttons template",
    template: {
      "type": "buttons",
      "actions": [
        {
          "type": "uri",
          "label": "スクエアステップ",
          "uri": "https://youtu.be/3O3mlcSgONE"
        },
        {
          "type": "uri",
          "label": "google検索",
          "uri": "http://www.google.com"
        },
        {
          "type": "uri",
          "label": "加速度センサー",
          "uri": "https://ksnk.jp/testgyro.html"
        },
      ],
      "title": "おうちスクエアステップ案",
      "text": "メニューです"
    }
  }
  )
}