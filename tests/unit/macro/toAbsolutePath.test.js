const test = require('ava');
const toAbsolutePath = require('../../../macro/toAbsolutePath');




test('ルートパスにホスト名とプロトコルを追加することが出来る', t => t.deepEqual(toAbsolutePath('/foo/bar/buzz.html', 'http://hoge:fuga@example.com/hoge/fuga.html'), 'http://hoge:fuga@example.com/foo/bar/buzz.html'));
test('相対パスを絶対パスのロケーション基準で絶対パスへ変換出来る', t => t.deepEqual(toAbsolutePath('foo/bar/buzz.html', 'http://hoge:fuga@example.com/hoge/fuga.html'), 'http://hoge:fuga@example.com/hoge/foo/bar/buzz.html'));
test('絶対パスは特に触らない(変化させない)', t => {
	t.deepEqual(toAbsolutePath('http://example.net/hoge/fuga.html', 'http://hoge:fuga@example.org/foo/bar.html'), 'http://example.net/hoge/fuga.html');
	t.deepEqual(toAbsolutePath('//example.net/hoge/fuga.html', 'http://hoge:fuga@example.org/foo/bar.html'), '//example.net/hoge/fuga.html');
});