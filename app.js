const restify = require('restify');
const request = require('request');
const builder = require('botbuilder');

// ローカルの場合.envからアプリ設定値を取得（Azureのダッシュボード上の設定＞アプリケーション設定＞アプリ設定値でやってることと同じ）
if (!process.env.SLACK_WEBFOOK_URL) {
  require('dotenv').config();
}
//console.log(process.env);
// Setup Restify Server -- サーバー起動
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users -- Botが下記URLに対するPOSTを待つ
server.post('/api/messages', connector.listen());



// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
const bot = new builder.UniversalBot(connector, [
    // function (session) {
    //   // メッセージ送信
    //   var msg = new builder.Message(session);
    //   msg.text("このようにもメッセージが作れる");
    //   session.send(msg);
    //   // このように書いても同じ
    //   session.send({
    //      type: 'message',
    //      text: "Hello World!"
    //   });
    // },
    // function (session) {
    //   request.post(getOptions(session.message.text), function(error, response, body){}); // slackのwebfookに対してPOST
    //   console.log(session.message.text);
    //   if (session.message.text === '天気') {
    //     session.send("天気と入力されたら固定でこれを出力する");  
    //   } else {
    //     session.send("You said: %s", session.message.text);
    //   }
    // }
    function (session) {
        builder.Prompts.text(session, "ドーモ。こんにちは。コノハちゃん博士です。教えて欲しいことがあれば言ってみるのです。");
        request.post(getPromptsDialog(), function(error, response, body){});
    },
    function (session, results) {
        if (results && results.response) {
            // User answered question.
            request.post(getOptions(results.response), function(error, response, body){});
            session.send("なのです。");
        } else {
            // User said never mind.
            session.send("OK. Goodbye.");
        }
    }
    ]);

// ミミちゃん助手にPOST
function getOptions(message,analized) {
  let options = {
    uri:　process.env.SLACK_WEBFOOK_URL,
    headers: {
      "Content-type": "application/json",
    },
    json: {
      "text":"お前が言った\n> " + message + "\nについて我々はかしこいので知っているのです。ふんす！:triumph: \n教えて欲しければカレー:curry:を持ってくるのです。\n",
      "link_names":true,
      channel:"#github"
    }
  };
  return options;
}
function getPromptsDialog() {
  let options = {
    uri:　process.env.SLACK_WEBFOOK_URL,
    headers: {
      "Content-type": "application/json",
    },
    json: {
      "text":"ドーモ。ミミちゃん助手です。\n我々はかしこいのでお前の知りたいことについて知っているかもしれないのです。",
      "link_names":true,
      channel:"#github"
    }
  };
  return options;
}