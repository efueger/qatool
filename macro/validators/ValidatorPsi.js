const log = require('../log.js');
const options = require('../../options.js');
const psi = require('psi');
const ValidationResult = require('./ValidationResult.js');
const Validator = require('./Validator.js');

/**
 * Google PageSpeed Insights のスコアを検証する機能を提供するクラスです。
 * スピードスコアが合格ラインを見対しているかどうか検証することができます。
 * @type {module.ValidatorPsi}
 */
module.exports = class ValidatorPsi extends Validator {
	constructor() {
		super('Google PageSpeed Insights');
	}

	/**
	 * バリデーションを実行します。
	 * デスクトップとモバイルそれぞれのスピードスコアが最低合格ラインを満たしていれば合格とみなし、
	 * さもなければ不合格とみなします。
	 * @param url 調べたい URL
	 * @param key Google PageSpeed Insights の API キー
	 * @returns {Promise<module.ValidationResult>} 検証が完了したら解決する Promise
	 */
	async validate(url, key) {
		const resultDesktop = await psi(url, {key: key, strategy: 'desktop'}).catch(err => log(err));
		const resultMobile = await psi(url, {key: key, strategy: 'mobile'}).catch(err => log(err));
		const desktopSpeedScore = resultDesktop.ruleGroups.SPEED.score;
		const mobileSpeedScore = resultMobile.ruleGroups.SPEED.score;
		const isValidDesktop = desktopSpeedScore >= options.validation.psi.speedThreshold.desktop;
		const isValidMobile = mobileSpeedScore >= options.validation.psi.speedThreshold.mobile;
		return new ValidationResult(isValidDesktop && isValidMobile, [
			`Speed score desktop: ${desktopSpeedScore}`,
			`Speed score mobile: ${mobileSpeedScore}`
		]);
	}
};