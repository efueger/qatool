const test = require('ava');
const ValidatorDeadLink = require('../../../../macro/validators/ValidatorDeadLink.js');

const htmlUrlExample = 'http://example.com/hoge/fuga.html';
const htmlValid = '' +
	'<!DOCTYPE html>' +
	'<html lang="en">' +
	'<head>' +
	'<meta charset="UTF-8">' +
	'<title>foo bar</title>' +
	'</head>' +
	'<body>' +
	'<p><a href="http://example.com/">Fire</a></p>' +
	'</body>' +
	'</html>';
const htmlInvalid = '' +
	'<!DOCTYPE html>' +
	'<html lang="en">' +
	'<head>' +
	'<meta charset="UTF-8">' +
	'<title>foo bar</title>' +
	'</head>' +
	'<body>' +
	'<p><a href="http://era.frondator/nixus.html">Fire</a></p>' +
	'</body>' +
	'</html>';
const v = new ValidatorDeadLink();




test('リンク切れのファイル参照が一つでも存在すればNGとみなす。', async t => {
	const result = await v.validate(htmlUrlExample, htmlInvalid, false).catch(err => t.log(err));
	t.false(result.isValid());
});

test('リンク切れのファイル参照が一つも存在しなければOKとみなす。', async t => {
	const result = await v.validate(htmlUrlExample, htmlValid, false).catch(err => t.log(err));
	t.true(result.isValid());
});