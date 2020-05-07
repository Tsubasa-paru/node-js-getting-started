const fs = require('fs');
const csvSync = require('csv-parse/lib/sync'); // requiring sync module

const filename = 'reply.csv';

function read_csv(file) {
  let data = fs.readFileSync(file);
  let res = csvSync(data);
  return res;
}
//console.log(read_csv(file));

const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
//const line = require("@line/bot-sdk"); //認証用
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY
};
//const client = new line.Client(config); //認証用

express()
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .get("/g/", (req, res) => res.json({ method: "こんにちは、getさん" }))
  .post("/p/", (req, res) => res.json({ method: "こんにちは、postさん" }))
  .post("/hook/", (req, res) => lineBot(req, res))
  //.post("/hook/", line.middleware(config), (req, res) => lineBot(req, res)) //認証用
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

function lineBot(req, res) {
  res.status(200).end();
  // ここから追加
  const events = req.body.events;
  const promises = [];
  for (let i = 0, l = events.length; i < l; i++) {
    const ev = events[i];
    promises.push(
      echoman(ev)
      //getmenu(ev)
    );
  }
  Promise.all(promises).then(console.log("pass"));
}

// 追加
async function echoman(ev) {
  const pro = await client.getProfile(ev.source.userId);
  var reply_text = read_csv(filename);
  return client.replyMessage(ev.replyToken, {
    type: "text",
    //"content": reply_text[0][1],
    text: reply_text[0][0] + `${pro.displayName}さん、今「${ev.message.text}」って言いました？`
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