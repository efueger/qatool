/**
 * 引数で指定された文字列が URL 表現であるかどうか調べ、その結果を返す。
 * 出典: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
 * @param {String} str URL 表現であるかどうか調べたい文字列
 * @returns {Boolean} 引数で指定された文字列が URL 表現であれば true、さもなければ false
 */
module.exports = function isUrl(str) {
	const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
		'(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
	return pattern.test(str);
};