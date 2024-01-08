module.exports = async function () {
  // NOTE: 結合テスト起動時に開発用サーバーが動作していてもポートがバッティングしないようにポートを変更する
  // JEST_WORKER_IDは1始まり
  const port = 3000 + parseInt(process.env.JEST_WORKER_ID || '1', 10);
  process.env.PORT = '' + port;
};
