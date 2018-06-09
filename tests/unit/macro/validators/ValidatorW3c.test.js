// ツール取得
const options = require('../../../../options.js');
const test = require('ava');
const ValidatorW3c = require('../../../../macro/validators/ValidatorW3c.js');

// テスト用データ
const validHtmlStr = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Document</title></head><body></body></html>';
const invalidHtmlStr = '<html lang="en"><head><meta charset="UTF-8"><title>Document</title></head><body></body></html>'; // ← DOCTYPE 宣言の無い HTML
const v = new ValidatorW3c();




// テスト実行
test('文法エラーの無いHTMLをバリデーションすると、合格とみなされます。', async t => {
	const result = await v.validate(validHtmlStr);
	t.true(result.isValid());
});

test('文法エラーの有るHTMLをバリデーションすると、不合格とみなされます。', async t => {
	const result = await v.validate(invalidHtmlStr);
	t.false(result.isValid());
});