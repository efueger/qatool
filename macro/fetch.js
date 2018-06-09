const http = require('http');


/**
 * 非同期通信で任意の API に GET リクエストを行い、レスポンス結果を取得します。
 * @param {String} url GET リクエストを行う URL
 * @returns {Promise<any>} レスポンス結果の取得が完了したら解決する Promise
 */
module.exports = function fetch(url) {
	let clientRequestInstance = null;
	return new Promise((resolve, reject) => {
		clientRequestInstance = http.get(url, res => {
			let body = '';
			res.setEncoding('utf8');
			res.on('data', chunk => {body += chunk;});
			res.on('end', () => resolve({body:body, headers:res.headers}));
			res.on('error', err => reject(err));
		});
	});
};