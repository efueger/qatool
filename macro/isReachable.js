const request = require('request');

/**
 * 指定した URL に HTTP アクセス出来るか調べ、その結果を返します。
 * @param {String} targetUrl URL
 * @return {Promise} 指定した URI に HTTP アクセス出来るか調べ終えたら解決する Promise
 */
module.exports = function isReachable(targetUrl) {
	return new Promise(function(resolve) {
		let headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36'};
		request({url: targetUrl, method: 'HEAD', headers: headers}, function(err, response) {
			if(err) {resolve(false);}
			else {resolve(response.statusCode.toString().match(/^1|^2|^3/));}
		});
	});
};
