const options = require('../../options.js');
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
	 * @param {Object} psiDesktopResult デスクトップのスピードテストリザルト
	 * @param {Object} psiMobileResult モバイルのスピードテストリザルト
	 * @returns {module.ValidationResult} バリデーション結果
	 */
	validate(psiDesktopResult, psiMobileResult) {
		const desktopSpeedScore = psiDesktopResult.ruleGroups.SPEED.score;
		const mobileSpeedScore = psiMobileResult.ruleGroups.SPEED.score;
		const isValidDesktop = desktopSpeedScore >= options.validation.psi.speedThreshold.desktop;
		const isValidMobile = mobileSpeedScore >= options.validation.psi.speedThreshold.mobile;
		return new ValidationResult(isValidDesktop && isValidMobile, [
			`Speed score desktop: ${desktopSpeedScore}`,
			`Speed score mobile: ${mobileSpeedScore}`
		]);
	}
};