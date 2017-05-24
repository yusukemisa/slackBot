const restify = require('restify');
const request = require('request');
const builder = require('botbuilder');

// ローカルの場合.envからアプリ設定値を取得（Azureのダッシュボード上の設定＞アプリケーション設定＞アプリ設定値でやってることと同じ）
if (!process.env.SLACK_WEBFOOK_URL) {
  require('dotenv').config();
}
console.log(process.env);
// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

function getOptions(message,analized) {
  let options = {
    uri:　process.env.SLACK_WEBFOOK_URL,
    headers: {
      "Content-type": "application/json",
    },
    json: {
      "text":"こんな風に変えると\n> " + message + "\nについて我々はかしこいので知っているのです。ふんす！:triumph: \n教えて欲しければカレー:curry:を持ってくるのです。\n",
      "link_names":true,
      channel:"#github"
    }
  };
  return options;
}


// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
const bot = new builder.UniversalBot(connector, function (session) {
    request.post(getOptions(session.message.text), function(error, response, body){});
    session.send("You said: %s", session.message.text);
});