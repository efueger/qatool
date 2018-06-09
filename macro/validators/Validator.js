/**
 * バリデータの抽象クラスです。
 * 継承して具象バリデータを実装して下さい。
 */
module.exports = class Validator {
	/**
	 * コンストラクタ。
	 * Validator クラスは抽象クラスなので、このクラスを直接 new するとエラーが発生します。
	 * @param {String} label このバリデーションの名前 (他のバリデーションとこのバリデーションが区別できる名前を設定して下さい)
	 */
	constructor(label) {
		if(new.target === Validator) {
			throw new TypeError('Cannot construct Abstract instances directly');
		}
		this._label = label;
	}

	/**
	 * このバリデーションの名前を取得します。
	 * @returns {String|*} このバリデーションの名前
	 */
	getLabel() {return this._label;}

	/**
	 * バリデーションを実行します。
	 * このメソッドは抽象メソッドなので、このメソッドを直接実行するとエラーが発生します。
	 * このクラスを継承した具象クラスの中で、このメソッドをオーバーライドし、バリデーション実行の処理を実装して下さい。
	 */
	validate() {throw new Error('You have to implement the method doValidate!');}
};