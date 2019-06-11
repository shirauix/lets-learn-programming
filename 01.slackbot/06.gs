// グローバル変数 (どの関数からでも参照できる変数) を定義
var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXXXXXXXXXXXXXX/edit#gid=0';
var SHEET_NAME = 'シート1';
var SLACK_URL = 'https://hooks.slack.com/services/XXXXXXXXXXXXXXXXXXXXXXXXXXXX';
var SLACK_USERNAME = 'Slackbot';
var SLACK_ICON = ':memo:';

/*
 * 名前のリストをスプレッドシートから取得する関数
 *
 * 戻り値
 *   名前(文字列)を要素とする配列
 */
function getNameList() {
  // SpreadsheetAppを使ってスプレッドシートの特定のシートを開く
  // https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app
  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);

  // データの存在する範囲を開く
  var range = sheet.getDataRange();
  var rows = range.getValues();
  
  // 名前を要素とする配列を作る
  var nameList = [];
  for (var i = 0; i < rows.length; i++) {
    // 1行目 (インデックスは0) は見出しなのでスキップする
    if (i === 0) {
      continue;
    }
      
    // 1列目 (インデックスは0) に名前が入っているとみなして、配列に追加する
    var row = rows[i];
    var name = row[0];
    nameList.push(name);    
  }

  return nameList;
}

/*
 * 長さlengthの配列から、ランダムにインデックスを求める関数
 *
 * 引数
 *   length: 配列の長さ
 * 
 * 戻り値 
 *   0以上length未満のランダムな整数
 */
function getRandomIndex(length) {
  // 0以上1未満のランダムな数を求める
  // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  var randomNumber = Math.random();       

  // 0 以上 (配列の要素数-1) 以下の数を求める
  // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
  var index = Math.floor(randomNumber * length);

  return index;
}

/*
 * 表示するメッセージを取得する関数
 *
 * 戻り値
 *   メッセージ(文字列)
 */
function getMessage() {
  // 名前データを取得    
  var nameList = getNameList();

  // ランダムに1つの名前を取り出す
  var index = getRandomIndex(nameList.length);
  var name = nameList[index];

  // 表示するメッセージを組み立てる
  var message = name + 'さん、今日の司会をお願いします！';
  return message;
}

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
  var message = getMessage();
  
  // Slackに通知
  notifyToSlack(SLACK_URL, message);
}
