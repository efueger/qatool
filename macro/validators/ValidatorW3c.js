const {exec} = require('child_process');
const fs = require('fs');
const uuid = require('uuid/v1');
const ValidationResult = require('./ValidationResult.js');
const Validator = require('./Validator.js');

/**
 * The W3C Markup Validation の検証を行うクラスです。
 * エラーが一つもなければ合格とみなし、一つでもエラーがあれば不合格とみなします。
 * @type {module.ValidatorW3c}
 */
module.exports = class ValidatorW3c extends Validator {
	constructor() {
		super('The W3C Markup Validation');
	}

	/**
	 * バリデーションを実行します。
	 * エラーが一つもなければ合格とみなし、一つでもエラーがあれば不合格とみなします。
	 * @param {String} htmlStr 検証する HTML
	 * @returns {Promise} バリデーションが完了したら解決する Promise
	 */
	validate(htmlStr) {
		return new Promise(function(resolve, reject) {
			const tmpDirPath = `${process.cwd()}/tmp`;
			const tmpHtmlFilePath = `${tmpDirPath}/${uuid()}.html`;
			if(!fs.existsSync(tmpDirPath)) {fs.mkdirSync(tmpDirPath);}
			fs.writeFileSync(tmpHtmlFilePath, htmlStr);
			exec(`java -jar ${process.cwd()}/node_modules/vnu-jar/build/dist/vnu.jar --format json ${tmpHtmlFilePath}`, function(err, stderr, stdout) {
				if(err instanceof Error && err.killed) {reject(err);}
				else {
					try {
						const result = JSON.parse(stdout);
						resolve(new ValidationResult(result.messages.length === 0, result.messages));
					} catch(err) {
						reject(err);
					}
				}
			})
		});
	}
};