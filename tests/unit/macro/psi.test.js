// ツール取得
const test = require('ava');
const checkPsi = require('../../../macro/psi');
const key = require('../../../keys').googleApiKey;

// テスト用ダミーデータ
const urlExample = 'http://example.com/';




test('デスクトップのスピードテスト点数が取得できる', async t => {
	const result = await checkPsi(urlExample, key);
	t.true(typeof result.desktop.ruleGroups.SPEED.score !== 'undefined');
});

test('モバイルのスピードテスト点数が取得できる', async t => {
	const result = await checkPsi(urlExample, key);
	t.true(typeof result.mobile.ruleGroups.SPEED.score !== 'undefined');
});