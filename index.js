const fs = require('fs');
const csvSync = require('csv-parse/lib/sync'); // requiring sync module
const NCMB = require('ncmb');
const ncmb = new NCMB("a044cf8e6e945d7e92493c2d739e0da050fc55b4134366094cd4311be2614b13",
  "d29b85f46dc1dc8853c69cce381e140f750bbcc93de49b21878a935983e8634f");
const stream = require("stream");

/*const filename = 'reply.csv';

function read_csv(file) {
  let data = fs.readFileSync(file);
  let res = csvSync(data);
  return res;
}
//console.log(read_csv(file));

function reply(text, file) {//こんにちはだけ判別してくれない
  let reply_text = "";
  const data = read_csv(file);
  for (let i in data) {
    //console.log(text == data[i][0]);
    if (text == data[i][0]) {
      //console.log(data[i][0]);
      reply_text = data[i][1];
      break;
    }
  }
  return reply_text;
}*/

const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const line = require("@line/bot-sdk"); //認証用
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY
};
const client = new line.Client(config); //認証用

express()
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .get("/g/", (req, res) => res.json({ method: "こんにちは、getさん" }))
  .post("/p/", (req, res) => res.json({ method: "こんにちは、postさん" }))
  //.post("/hook/", (req, res) => lineBot(req, res))
  .post("/hook/", line.middleware(config), (req, res) => lineBot(req, res)) //認証用
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

function lineBot(req, res) {
  res.status(200).end();
  // ここから追加
  const events = req.body.events;
  const promises = [];
  for (let i = 0, l = events.length; i < l; i++) {
    const ev = events[i];
    if (ev.type === "message" && (ev.message.text == "メニュー" || ev.message.type == "sticker")) {//messageのタイプ確認必須
      promises.push(
        getmenu(ev)
      );
    }
    else if (ev.type === "postback") {
      if (JSON.parse(ev.postback.data).action === "exercise") {
        promises.push(
          exercise_menu(ev)
        );
      } else if (JSON.parse(ev.postback.data).action === "send_image") {
        promises.push(
          send_image(ev)
        );
      } else if (JSON.parse(ev.postback.data).action === "confirm") {
        promises.push(
          confirm(ev)
        );
      } else if (JSON.parse(ev.postback.data).action === "chofu") {
        promises.push(
          chofu(ev)
        );
      } else if (JSON.parse(ev.postback.data).action === "4") {
        promises.push(
          thank(ev)
        );
      } else if (JSON.parse(ev.postback.data).action === "7") {
        promises.push(
          thank(ev)
        );
      } else if (JSON.parse(ev.postback.data).action === "10") {
        promises.push(
          thank(ev)
        );
      } else if (JSON.parse(ev.postback.data).action === "over10") {
        promises.push(
          thank(ev)
        );
      }
    }
    else if (ev.message.type === "image") {
      promises.push(
        test(ev)
      );
    }
    else if (ev.type === "message") {
      promises.push(
        talk(ev)
      );
    }
    else {
      promises.push(
        alart(ev)
      );
    }
  }
  Promise.all(promises).then(console.log("pass"));
}

async function test(ev) {
  /*ncmb.File.delete("abc.txt")
    .then(function () {
      // 削除後処理
      return client.replyMessage(ev.replyToken, {
        type: "text",
        text: `succeeded`
      })
    })
    .catch(function (err) {
      // エラー処理
    });*/
  return client.replyMessage(ev.replyToken, {
    type: "text",
    text: `this is a file`
  })
}

async function store_log(ev) {
  var Log = ncmb.DataStore("Log");
  var log = new Log();
  log.set("user", (await client.getProfile(ev.source.userId)).displayName)
    .set("message", ev.message.text)
    .set("userID", ev.source.userId)
  log.save()
    .then(function () {
      // 保存後の処理
      /*return client.replyMessage(ev.replyToken, {
        type: "text",
        text: `succeeded`
      })*/
    })
    .catch(function () {
      // エラー処理
      /*return client.replyMessage(ev.replyToken, {
        type: "text",
        text: `error`
      })*/
    });
}

async function talk(ev) {
  const fetch = require('node-fetch');

  const params = new URLSearchParams();
  params.append('apikey', "DZZguM1BiGS7wdbTinRibmkUlJWYNoFs");
  params.append('query', ev.message.text);

  fetch("https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk", { method: 'POST', body: params })
    .then(Response => {
      Response.json().then(Data => {
        return client.replyMessage(ev.replyToken, {
          type: "text",
          text: Data.results[0].reply
        })
      });
    });
  store_log(ev);
}

async function send_image(ev) {
  const pro = await client.getProfile(ev.source.userId);
  const name = pro.displayName;
  const url_name = encodeURIComponent(name);
  return client.replyMessage(ev.replyToken, {
    type: "image",
    originalContentUrl: "https://mbaas.api.nifcloud.com/2013-09-01/applications/Z396PcI7dL5wDYZY/publicFiles/" + url_name + "result.png",
    previewImageUrl: "https://mbaas.api.nifcloud.com/2013-09-01/applications/Z396PcI7dL5wDYZY/publicFiles/" + url_name + "result.png"
  });
}

async function exercise_menu(ev) {
  return client.replyMessage(ev.replyToken, {
    type: "template",
    altText: "運動メニュー",
    template: {
      "type": "buttons",
      "actions": [
        {
          "type": "postback",
          "label": "10の筋力トレーニング",
          "data": JSON.stringify({ "action": "chofu" })
        },
        {
          "type": "postback",
          "label": "準備中",
          "data": JSON.stringify({ "action": "inprogress" })
        },
      ],
      "title": "運動メニューです",
      "text": "選択してください"
    }
  }
  )
}

async function chofu(ev) {
  var Log = ncmb.DataStore("Exercise");
  var log = new Log();
  log.set("user", (await client.getProfile(ev.source.userId)).displayName)
    .set("message", ev.message.text)
    .set("userID", ev.source.userId)
    .set("menu", "10トレ")
  log.save()
  return client.replyMessage(ev.replyToken, {
    type: "template",
    altText: "調布10の筋力トレーニング",
    template: {
      "type": "buttons",
      "actions": [
        {
          "type": "uri",
          "label": "初級",
          "uri": "https://www.youtube.com/watch?v=xUb6BN_Lixk"
        },
        {
          "type": "uri",
          "label": "中級",
          "uri": "https://www.youtube.com/watch?v=IBc4US3iiiY&t=533s"
        },
        {
          "type": "uri",
          "label": "上級",
          "uri": "https://www.youtube.com/watch?v=yeQBkH9EKNM"
        },
      ],
      "title": "調布10の筋力トレーニング",
      "text": "難易度を選択してください"
    }
  }
  )
}

async function getmenu(ev) {
  return client.replyMessage(ev.replyToken, {
    type: "template",
    altText: "運動支援メニュー",
    template: {
      "type": "buttons",
      "actions": [
        /*{
          "type": "uri",
          "label": "タブレット操作方法",
          "uri": "https://mbaas.api.nifcloud.com/2013-09-01/applications/Z396PcI7dL5wDYZY/publicFiles/ICT%E3%83%AC%E3%82%AF%E3%83%81%E3%83%A3%E3%83%BC%E8%B3%87%E6%96%99.pdf"
        },*/
        {
          "type": "postback",
          "label": "運動する",
          "data": JSON.stringify({ "action": "exercise" })
        },
        {
          "type": "postback",
          "label": "成果を確認する",
          "data": JSON.stringify({ "action": "confirm" })
        },
      ],
      "title": "運動支援メニューです",
      "text": "選択してください"
    }
  }
  )
}

async function confirm(ev) {
  return client.replyMessage(ev.replyToken, {
    type: "template",
    altText: "this is a buttons template",
    template: {
      "type": "buttons",
      "actions": [
        {
          "type": "postback",
          "label": "1週間の歩数",
          "data": JSON.stringify({ "action": "send_image" })
        },
        {
          "type": "postback",
          "label": "準備中",
          "data": JSON.stringify({ "action": "inprogress" })
        },
      ],
      "title": "運動の成果",
      "text": "確認したい成果を選択してください"
    }
  }
  )
}

async function thank(ev) {
  steps = JSON.parse(ev.postback.data).action;
  var Log = ncmb.DataStore("Steps");
  var log = new Log();
  log.set("user", (await client.getProfile(ev.source.userId)).displayName)
    .set("steps", steps)
    .set("userID", ev.source.userId)
  log.save()

  var comments = ncmb.DataStore("Comments");
  var comment;
  comments.fetchAll()
    .then(function (results) {
      r = Math.random(results.length);
      comment = results[r].get("comments");
    })

  return client.replyMessage(ev.replyToken, {
    type: "text",
    text: "報告ありがとうございます！\n" + comment
  })
}

/*async function echoman(ev) {
  const pro = await client.getProfile(ev.source.userId);
  const filename = pro.displayName + '_reply.csv';
  let data = read_csv(filename);
  //let res = data.push(ev.message.text.toString())
  let reply_text = reply(ev.message.text.toString(), filename);
  //let reply_text = ev.message.text;
  return client.replyMessage(ev.replyToken, {
    type: "text",
    text: `${reply_text}_${pro.displayName}さん、今「${ev.message.text}」って言いました？`
  })
}*/

async function alart(ev) {
  return client.replyMessage(ev.replyToken, {
    type: "text",
    text: "対応しておりませんので、他の方法を試してください"
  })
}