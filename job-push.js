// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート

// パラメータ設定
const line_config = {
    channelAccessToken: process.env.ACCESS_TOKEN,
    channelSecret: process.env.SECRET_KEY
};


// APIコールのためのクライアントインスタンスを作成
const bot = new line.Client(line_config);

main();//メインとなる処理を適当に


async function reminder() {
    const users = ["U56de8fce231795fd906d98fe098669c6", "U0859d99f0c1c06059e13965f7c21123a"];
    for (let i = 0; i < users.length; i++) {
        bot.pushMessage(users[i], {
            type: "template",
            altText: "リマインダー",
            template: {
                "type": "buttons",
                "actions": [
                    {
                        "type": "postback",
                        "label": "4000歩以下",
                        "data": JSON.stringify({ "action": "4" })
                    },
                    {
                        "type": "postback",
                        "label": "4001~7000歩",
                        "data": JSON.stringify({ "action": "7" })
                    },
                    {
                        "type": "postback",
                        "label": "7001~10000歩",
                        "data": JSON.stringify({ "action": "10" })
                    },
                    {
                        "type": "postback",
                        "label": "10000歩以上",
                        "data": JSON.stringify({ "action": "over10" })
                    },
                ],
                "title": "本日の歩数を教えてください",
                "text": "活動量計のボタンを3回押して、歩数の確認お願いします。"
            }
        })
    }
}

function main() {
    //現在日付の取得
    var today = new Date();
    var month = today.getMonth() + 1;
    var date = today.getDate();
    reminder();
}