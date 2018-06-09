const URI = require('urijs');




/**
 * 引数で指定された相対パスを、プロトコルやホストネームを含んだ絶対パスに変換して返します。
 * 引数で相対パスの代わりに絶対パスを指定した場合、返り値はその絶対パスと同一になります。
 * @param {String} relativePath 絶対パスに変換したい相対パス
 * @param {String} fromUrl relativePathで指定した相対パスが指すファイルがホストされているサイトのURL
 * @return {String} 絶対パス
 */
module.exports = function toAbsolutePath(relativePath, fromUrl) {
	const baseUrl = new URI(fromUrl);
	const result = new URI(relativePath);
	if(!result.hostname()) {
		result.protocol(baseUrl.protocol());
		result.hostname(baseUrl.hostname());
		result.username(baseUrl.username());
		result.password(baseUrl.password());
	}
	if(!relativePath.match(/^\//) && !relativePath.match(/^http:\/\//) && !relativePath.match(/^https:\/\//)) {
		result.directory(`${baseUrl.directory()}/${result.directory()}`);
	}
	return result.toString();
};