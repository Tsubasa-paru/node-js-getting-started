const fs = require('fs');
const csvSync = require('csv-parse/lib/sync'); // requiring sync module
const NCMB = require('ncmb');
const ncmb = new NCMB("a044cf8e6e945d7e92493c2d739e0da050fc55b4134366094cd4311be2614b13",
  "d29b85f46dc1dc8853c69cce381e140f750bbcc93de49b21878a935983e8634f");

const filename = 'reply.csv';

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
}

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
    if (ev.type === "message" && ev.message.text == "メニュー") {
      promises.push(
        getmenu(ev)
      );
    } else if (ev.type === "postback") {
      if (JSON.parse(ev.postback.data).action === "menu2") {
        promises.push(
          second_menu(ev)
        );
      }
      else if (JSON.parse(ev.postback.data).action === "image") {
        promises.push(
          send_image(ev)
        );
      }
    }
    else if (ev.message.type === "file") {
      //else if (ev.message.text == "test") {
      promises.push(
        //man_file(ev)
        //save_file(ev)
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
        //talk(ev)
        echoman(ev)
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
}

async function save_file(ev) {
  fs.readFile('https://api.line.me/v2/bot/message/${req.body.events[0].message.id}/content', function (err, data) {
    if (err) throw err;
    var name = "abc.pdf";
    ncmb.File.upload(name, data)
      .then(function (data) {
        // アップロード後処理
        return client.replyMessage(ev.replyToken, {
          type: "text",
          text: `succeeded`
        })
      })
      .catch(function (err) {
        // エラー処理
        return client.replyMessage(ev.replyToken, {
          type: "text",
          text: `error`
        })
      });
  });
}

async function send_image(ev) {
  return client.replyMessage(ev.replyToken, {
    type: "image",
    originalContentUrl: "https://mbaas.api.nifcloud.com/2013-09-01/applications/Z396PcI7dL5wDYZY/publicFiles/%E3%81%A4%E3%81%B0%E3%81%95_result.png",
    previewImageUrl: "https://mbaas.api.nifcloud.com/2013-09-01/applications/Z396PcI7dL5wDYZY/publicFiles/%E3%81%A4%E3%81%B0%E3%81%95_result.png"
  });
}

async function second_menu(ev) {
  return client.replyMessage(ev.replyToken, {
    type: "template",
    altText: "this is a buttons template",
    template: {
      "type": "buttons",
      "actions": [
        {
          "type": "uri",
          "label": "uec homepage",
          "uri": "https://www.uec.ac.jp/"
        },
        {
          "type": "uri",
          "label": "boss",
          "uri": "https://www.uec.ac.jp/research/information/opal-ring/0006120.html"
        },
        {
          "type": "postback",
          "label": "画像",
          //"text": "次へ",
          "data": JSON.stringify({ "action": "image" })
        },
      ],
      "title": "電通大",
      "text": "選択してください"
    }
  }
  )
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
          "type": "postback",
          "label": "メニュー２",
          //"text": "次へ",
          "data": JSON.stringify({ "action": "menu2" })
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

async function echoman(ev) {
  const pro = await client.getProfile(ev.source.userId);
  const filename = pro.displayName + '_reply.csv';
  let data = read_csv(filename);
  let reply_text = reply(ev.message.text.toString(), filename);
  //let reply_text = ev.message.text;
  return client.replyMessage(ev.replyToken, {
    type: "text",
    text: `${reply_text}_${pro.displayName}さん、今「${ev.message.text}」って言いました？`
  })
}