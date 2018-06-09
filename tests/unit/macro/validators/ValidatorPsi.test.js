// ツール取得
const keys = require('../../../../keys.js');
const options = require('../../../../options.js');
const test = require('ava');
const ValidatorPsi = require('../../../../macro/validators/ValidatorPsi.js');

const v = new ValidatorPsi();




// テスト実行
test('スピードスコアに問題の無いURLを検証すると合格の判定が得られます。', async t => {
	const result = await v.validate('http://example.com', keys.googleApiKey); // https://example.com はコンテンツが殆ど無く、それに伴い読込も速いため、基本的に点数は満点に近い状態になると想定されます。
	t.true(result.isValid());
});