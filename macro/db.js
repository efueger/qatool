// ツール読込
const DataStore = require('nedb');
const log = require('./log.js');

// データベースファイルパス定義
const PATH_DB_CRAWLS = 'db/crawls';
const PATH_DB_DEADLINKS = 'db/deadLinks';
const PATH_DB_VALIDATIONS = 'db/validations';

/**
 * NeDB の初期化オプションオブジェクトを返します。
 * filename 以外基本いじらないため、filename だけ指定すれば、残りのオプションをいい感じに設定したオプションオブジェクトを返します。
 * オプションのリファレンス: https://github.com/louischatriot/nedb
 * @param {String} filename データベースファイルのパス
 * @returns {{filename: String, timestampData: Boolean, inMemoryOnly: Boolean, nodeWebkitAppName: String, autoload: Boolean, onload: Function, afterSerialization: Function, corruptAlertThreshold: Number, compareStrings: Function}}
 */
const createOptions = filename => {
	return {
		filename: filename,
		timestampData: true,
		autoload: true,
		onload: function logSuccessfullyDatabaseLoadedMessage() {log(`[NeDB] ${filename} is successfully loaded.`);}
	}
};

// データベース読込
const dbCrawls = new DataStore(createOptions(PATH_DB_CRAWLS));
const dbDeadLinks = new DataStore(createOptions(PATH_DB_DEADLINKS));
const dbValidations = new DataStore(createOptions(PATH_DB_VALIDATIONS));

/**
 * 読込が完了した各データベースの参照を格納したオブジェクトです。
 * @type {{crawls: (Datastore|*)}}
 */
module.exports = {
	crawls: dbCrawls,
	deadLinks: dbDeadLinks,
	validations: dbValidations
};