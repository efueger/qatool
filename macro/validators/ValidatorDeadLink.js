const db = require('../db.js');
const {exec} = require('child_process');
const fs = require('fs');
const getReferredFilePath = require('../getReferredFilePaths.js');
const isReachable = require('../isReachable.js');
const uuid = require('uuid/v1');
const ValidationResult = require('./ValidationResult.js');
const Validator = require('./Validator.js');

const isKnownDeadLink = url => {
	return new Promise((resolve, reject) => {
		db.deadLinks.findOne({location: url}, (err, found) => {
			if(err) {reject(err);}
			else {
				if(found === null) {resolve(false);}
				else {resolve(true);}
			}
		});
	});
};

const saveDeadLink = (url) => {
	const data = {location: url};
	return new Promise((resolve, reject) => {
		db.deadLinks.findOne(data, async(err, found) => {
			if(err) {
				reject(err);
			} else {
				if(found === null) {
					db.deadLinks.insert(data, err => {
						if(err) {reject(err);}
						else {resolve();}
					});
				}
			}
		});
	});
};

/**
 * デッドリンクの検証を行うクラスです。
 * デッドリンクが一つもなければ合格とみなし、一つでもデッドリンクがあれば不合格とみなします。
 * @type {module.ValidatorDeadLink}
 */
module.exports = class ValidatorDeadLink extends Validator {
	constructor() {
		super('Dead Link Check');
	}

	/**
	 * バリデーションを実行します。
	 * デッドリンクが一つもなければ合格とみなし、一つでもデッドリンクがあれば不合格とみなします。
	 * @param {String} htmlUrl 検証する HTML の URL
	 * @param {String} htmlStr 検証する HTML
	 * @param {Boolean} isCacheFoundDeadLinks false にした場合、デッドリンクを見つけても DB にメモを行いません
	 * @returns {Promise} バリデーションが完了したら解決する Promise
	 */
	validate(htmlUrl, htmlStr, isCacheFoundDeadLinks=true) {
		return new Promise(async function(resolve, reject) {
			const paths = getReferredFilePath(htmlUrl, htmlStr);
			let deadLinks = [];
			for(const path of paths) {
				const isDeadLink = await isKnownDeadLink(path);
				if(isDeadLink) {deadLinks.push(path);}
				else {
					const isReachableResource = await isReachable(path);
					if(!isReachableResource) {deadLinks.push(path);}
				}
			}
			if(isCacheFoundDeadLinks) {
				for(const deadLink of deadLinks) {await saveDeadLink(deadLink).catch(err => reject(err));}
			}
			resolve(new ValidationResult(deadLinks.length === 0, deadLinks));
		});
	}
};