const fs = require('fs');
const util = require('util');
const uuid = require('uuid/v1');
const ValidationResult = require('./ValidationResult.js');
const Validator = require('./Validator.js');
const vnu = require ( 'vnu-jar' );

// const exec = util.promisify(require('child_process').exec);
const exec = require('child_process').exec;

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
			try {
				const tmpDirPath = `${process.cwd()}/tmp`;
				const tmpHtmlFilePath = `${tmpDirPath}/${uuid()}.html`;
				if(!fs.existsSync(tmpDirPath)) {fs.mkdirSync(tmpDirPath);}
				fs.writeFileSync(tmpHtmlFilePath, htmlStr);
				exec(`java -jar ${vnu} --format json ${tmpHtmlFilePath}`, function(err, stdout, stderr) {
					if(err) {
						const result = JSON.parse(stderr);
						resolve(new ValidationResult(result.messages.length === 0, result.messages));
					}
					else {resolve(new ValidationResult(true, []))}
				});
			} catch(err) {
				reject(err);
			}
		});
	}
};