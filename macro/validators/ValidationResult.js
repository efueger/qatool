/**
 * バリデーション結果データを表現するクラスです。
 * @type {module.ValidationResult}
 */
module.exports = class ValidationResult {
	/**
	 * コンストラクタ。
	 * @param {Boolean} isValid このバリデーション結果が合格か不合格か (true なら合格)
	 * @param {Array<String>} messages このバリデーション結果に関する解説のリスト
	 */
	constructor(isValid, messages) {
		this._isValid = isValid;
		this._messages = messages;
	}

	/**
	 * このバリデーション結果が合格か不合格か返します。
	 * @returns {Boolean|*} このバリデーション結果が合格であれば true、さもなければ false
	 */
	isValid() {return this._isValid;}

	/**
	 * このバリデーション結果に関する解説のリストを返します。
	 * @returns {Array<String>|*} このバリデーション結果に関する解説のリスト
	 */
	getMessages() {return this._messages;}
};