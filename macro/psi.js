const log = require('./log.js');
const psi = require('psi');




/**
 * Google PageSpeed Insights の検証結果を調べ、その結果を返します。
 * @param url 調べたい URL
 * @param key Google PageSpeed Insights の API キー
 * @return {Object} Google PageSpeed Insights の検証結果
 */
module.exports = async function checkPsi(url, key) {
	const resultDesktop = await psi(url, {key: key, strategy: 'desktop'}).catch(err => log(err));
	const resultMobile = await psi(url, {key: key, strategy: 'mobile'}).catch(err => log(err));
	return {desktop: resultDesktop, mobile: resultMobile};
};