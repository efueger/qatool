const cheerio = require('cheerio');
const toAbsolutePath = require('./toAbsolutePath');

/**
 * 指定されたHTMLから参照されているファイルのURLを配列に纏めて返します。
 * @param {String} htmlUrl 参照しているファイルを調べたいHTMLのURL
 * @param {String} html 参照しているファイルを調べたいHTML
 * @return {Array} 参照されているファイルのURLのリスト
 */
module.exports = function getReferredFiles(htmlUrl, html) {
	const $ = cheerio.load(html);
	const getData = v => $(v).attr('data');
	const getHref = v => $(v).attr('href');
	const getSrc = v => $(v).attr('src');
	const isExists = v => typeof v !== 'undefined' && v !== null;
	const removeMailTo = v => !v.match('mailto:');
	const removeVoid = v => !v.match('void(0)');
	const getPaths = ($element, pathGetter) => $element.get(0) ? $element.toArray().map(pathGetter).filter(isExists).filter(removeMailTo).filter(removeVoid) : [];
	const allPaths = getPaths($('a'), getHref)
	.concat(getPaths($('embed'), getSrc))
	.concat(getPaths($('iframe'), getSrc))
	.concat(getPaths($('img'), getSrc))
	.concat(getPaths($('link'), getHref))
	.concat(getPaths($('object'), getData))
	.concat(getPaths($('script'), getSrc))
	.concat(getPaths($('source'), getSrc))
	.concat(getPaths($('video'), getSrc));
	return allPaths.map(path => toAbsolutePath(path, htmlUrl));
};