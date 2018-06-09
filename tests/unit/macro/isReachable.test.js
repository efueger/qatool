const test = require('ava');
const isReachable = require('../../../macro/isReachable');




test('HTTP アクセスできる URI を渡すと true を返します。', async function(t) {
	t.truthy(await isReachable('http://example.com'));
});
test('HTTP アクセスできない URI を渡すと false を返します。', async function(t) {
	t.falsy(await isReachable('http://example.invalid'));
});
