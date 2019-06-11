// グローバル変数 (どの関数からでも参照できる変数) を定義
var SLACK_URL = 'https://hooks.slack.com/services/XXXXXXXXXXXXXXXXXXXXXXXXXXXX';
var SLACK_USERNAME = 'Slackbot';
var SLACK_ICON = ':memo:';

/*
 * Slackに通知する関数
 *
 * 引数
 *   slackUrl: Slackに通知するURL
 *   message: 表示するメッセージ
 */
function notifyToSlack(slackUrl, message) {
  // Slackが求めるデータ構造を作る
  // https://api.slack.com/incoming-webhooks
  var payload = {
    username: SLACK_USERNAME,
    icon_emoji: SLACK_ICON,
    text: message
  };

  // JSON (JavaScript Object Notation) 形式に変換
  payload = JSON.stringify(payload);
  
  // UrlFetchAppに渡すデータ構造を作る
  var params = {
    method: 'POST',
    contentType: 'application/json',
    payload: payload
  };

  // 通信を実行 (UrlFetchAppを利用)
  // https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app
  UrlFetchApp.fetch(slackUrl, params);
}

/*
 * 最初に実行される関数
 */
function main() {
  // 通知するメッセージを取得
  var message = 'ソウゴさん、今日の司会をお願いします！';
  
  // Slackに通知
  notifyToSlack(SLACK_URL, message);
}
