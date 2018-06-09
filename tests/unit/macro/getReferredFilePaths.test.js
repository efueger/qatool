const getReferredFilePaths = require('../../../macro/getReferredFilePaths.js');
const test = require('ava');

const htmlExampleUrl = 'http://example.com/foo/bar.html';
const htmlExampleA = '' +
	'<!DOCTYPE html>' +
	'<html lang="en">' +
	'<head>' +
	'<meta charset="UTF-8">' +
	'<title>foo bar</title>' +
	'</head>' +
	'<body>' +
	'<p><a href="http://example.com/">Fire</a></p>' +
	'<p><a href="http://example.net/foo.html">Fire</a></p>' +
	'<p><a href="//example.org/bar/buzz.html">Fire</a></p>' +
	'<p><a href="/hoge/fuga.html">Fire</a></p>' +
	'<p><a href="hoge/fuga.html">Fire</a></p>' +
	'<p><a href="mailto:example@example.com">Fire</a></p>' +
	'</body>' +
	'</html>';
const htmlExampleEmbed = '' +
	'<!DOCTYPE html>' +
	'<html lang="en">' +
	'<head>' +
	'<meta charset="UTF-8">' +
	'<title>foo bar</title>' +
	'</head>' +
	'<body>' +
	'<embed src="http://example.com/img/example.jpg" />' +
	'<embed src="http://example.net/img/example.jpg" />' +
	'<embed src="//example.org/bar/img/example.jpg" />' +
	'<embed src="/hoge/img/example.jpg" />' +
	'<embed src="hoge/img/example.jpg" />' +
	'</body>' +
	'</html>';
const htmlExampleIframe = '' +
	'<!DOCTYPE html>' +
	'<html lang="en">' +
	'<head>' +
	'<meta charset="UTF-8">' +
	'<title>foo bar</title>' +
	'</head>' +
	'<body>' +
	'<iframe src="http://example.com/"></iframe>' +
	'<iframe src="http://example.net/foo.html"></iframe>' +
	'<iframe src="//example.org/bar/buzz.html"></iframe>' +
	'<iframe src="/hoge/fuga.html"></iframe>' +
	'<iframe src="hoge/fuga.html"></iframe>' +
	'</body>' +
	'</html>';
const htmlExampleImg = '' +
	'<!DOCTYPE html>' +
	'<html lang="en">' +
	'<head>' +
	'<meta charset="UTF-8">' +
	'<title>foo bar</title>' +
	'</head>' +
	'<body>' +
	'<p><img src="http://example.com/img/example.jpg" alt="Fire"></p>' +
	'<p><img src="http://example.net/img/example.jpg" alt="Fire"></p>' +
	'<p><img src="//example.org/img/example.html" alt="Fire"></p>' +
	'<p><img src="/img/example.jpg" alt="Fire"></p>' +
	'<p><img src="img/example.jpg" alt="Fire"></p>' +
	'</body>' +
	'</html>';
const htmlExampleLink = '' +
	'<!DOCTYPE html>' +
	'<html lang="en">' +
	'<head>' +
	'<meta charset="UTF-8">' +
	'<title>foo bar</title>' +
	'<link rel="stylesheet" href="http://example.com/css/common.css">' +
	'<link rel="stylesheet" href="http://example.net/css/common.css">' +
	'<link rel="stylesheet" href="//example.org/css/common.css">' +
	'<link rel="stylesheet" href="/css/common.css">' +
	'<link rel="stylesheet" href="css/common.css">' +
	'</head>' +
	'<body>' +
	'</body>' +
	'</html>';
const htmlExampleObject = '' +
	'<!DOCTYPE html>' +
	'<html lang="en">' +
	'<head>' +
	'<meta charset="UTF-8">' +
	'<title>foo bar</title>' +
	'</head>' +
	'<body>' +
	'<object data="http://example.com/img/example.jpg" />' +
	'<object data="http://example.net/img/example.jpg" />' +
	'<object data="//example.org/bar/img/example.jpg" />' +
	'<object data="/hoge/img/example.jpg" />' +
	'<object data="hoge/img/example.jpg" />' +
	'</body>' +
	'</html>';
const htmlExampleScript = '' +
	'<!DOCTYPE html>' +
	'<html lang="en">' +
	'<head>' +
	'<meta charset="UTF-8">' +
	'<title>foo bar</title>' +
	'<script src="http://example.com/js/common.js"></script>' +
	'<script src="http://example.net/js/common.js"></script>' +
	'<script src="//example.org/js/common.js"></script>' +
	'<script src="/js/common.js"></script>' +
	'<script src="js/common.js"></script>' +
	'</head>' +
	'<body>' +
	'</body>' +
	'</html>';
const htmlExampleSource = '' +
	'<!DOCTYPE html>' +
	'<html lang="en">' +
	'<head>' +
	'<meta charset="UTF-8">' +
	'<title>foo bar</title>' +
	'</head>' +
	'<body>' +
	'<video>' +
	'<source src="http://example.com/movie/common.mp4" />' +
	'<source src="http://example.net/movie/common.mp4" />' +
	'<source src="//example.org/movie/common.mp4" />' +
	'<source src="/movie/common.mp4" />' +
	'<source src="movie/common.mp4" />' +
	'</video>' +
	'</body>' +
	'</html>';
const htmlExampleVideo = '' +
	'<!DOCTYPE html>' +
	'<html lang="en">' +
	'<head>' +
	'<meta charset="UTF-8">' +
	'<title>foo bar</title>' +
	'</head>' +
	'<body>' +
	'<video src="http://example.com/movie/common.mp4" />' +
	'<video src="http://example.net/movie/common.mp4" />' +
	'<video src="//example.org/movie/common.mp4" />' +
	'<video src="/movie/common.mp4" />' +
	'<video src="movie/common.mp4" />' +
	'</body>' +
	'</html>';




test('a要素のhref属性で参照されているファイルのURLを正しく取得できる(mailto: のリンクはファイルではないので無視する)', t => {
	t.deepEqual(
		getReferredFilePaths(htmlExampleUrl, htmlExampleA),
		[
			'http://example.com/',
			'http://example.net/foo.html',
			'//example.org/bar/buzz.html',
			'http://example.com/hoge/fuga.html',
			'http://example.com/foo/hoge/fuga.html'
		]
	);
});
test('embed要素のsrc属性で参照されているファイルのURLを正しく取得できる', t => {
	t.deepEqual(
		getReferredFilePaths(htmlExampleUrl, htmlExampleEmbed),
		[
			'http://example.com/img/example.jpg',
			'http://example.net/img/example.jpg',
			'//example.org/bar/img/example.jpg',
			'http://example.com/hoge/img/example.jpg',
			'http://example.com/foo/hoge/img/example.jpg'
		]
	);
});
test('iframe要素のsrc属性で参照されているファイルのURLを正しく取得できる', t => {
	t.deepEqual(
		getReferredFilePaths(htmlExampleUrl, htmlExampleIframe),
		[
			'http://example.com/',
			'http://example.net/foo.html',
			'//example.org/bar/buzz.html',
			'http://example.com/hoge/fuga.html',
			'http://example.com/foo/hoge/fuga.html'
		]
	);
});
test('img要素のsrc属性で参照されているファイルのURLを正しく取得できる', t => {
	t.deepEqual(
		getReferredFilePaths(htmlExampleUrl, htmlExampleImg),
		[
			'http://example.com/img/example.jpg',
			'http://example.net/img/example.jpg',
			'//example.org/img/example.html',
			'http://example.com/img/example.jpg',
			'http://example.com/foo/img/example.jpg'
		]
	);
});
test('link要素のhref属性で参照されているファイルのURLを正しく取得できる', t => {
	t.deepEqual(
		getReferredFilePaths(htmlExampleUrl, htmlExampleLink),
		[
			'http://example.com/css/common.css',
			'http://example.net/css/common.css',
			'//example.org/css/common.css',
			'http://example.com/css/common.css',
			'http://example.com/foo/css/common.css'
		]);
});
test('object要素のdata属性で参照されているファイルのURLを正しく取得できる', t => {
	t.deepEqual(
		getReferredFilePaths(htmlExampleUrl, htmlExampleObject),
		[
			'http://example.com/img/example.jpg',
			'http://example.net/img/example.jpg',
			'//example.org/bar/img/example.jpg',
			'http://example.com/hoge/img/example.jpg',
			'http://example.com/foo/hoge/img/example.jpg'
		]
	);
});
test('script要素のsrc属性で参照されているファイルのURLを正しく取得できる', t => {
	t.deepEqual(
		getReferredFilePaths(htmlExampleUrl, htmlExampleScript),
		[
			'http://example.com/js/common.js',
			'http://example.net/js/common.js',
			'//example.org/js/common.js',
			'http://example.com/js/common.js',
			'http://example.com/foo/js/common.js'
		])
});
test('source要素のsrc属性で参照されているファイルのURLを正しく取得できる', t => {
	t.deepEqual(
		getReferredFilePaths(htmlExampleUrl, htmlExampleSource),
		[
			'http://example.com/movie/common.mp4',
			'http://example.net/movie/common.mp4',
			'//example.org/movie/common.mp4',
			'http://example.com/movie/common.mp4',
			'http://example.com/foo/movie/common.mp4'
		]);
});
test('video要素のsrc属性で参照されているファイルのURLを正しく取得できる', t => {
	t.deepEqual(
		getReferredFilePaths(htmlExampleUrl, htmlExampleVideo),
		[
			'http://example.com/movie/common.mp4',
			'http://example.net/movie/common.mp4',
			'//example.org/movie/common.mp4',
			'http://example.com/movie/common.mp4',
			'http://example.com/foo/movie/common.mp4'
		]);
});