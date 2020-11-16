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
                        "type": "message",
                        "label": "テスト",
                        "text": "テスト"
                    },
                ],
                "title": "リマインダーテストです",
                "text": "押してください"
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