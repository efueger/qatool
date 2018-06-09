// ツール読込
const express = require('express');
const db = require('../macro/db.js');
const fetch = require('../macro/fetch.js');
const log = require('../macro/log.js');
const router = express.Router();

/**
 * 引数で指定された文字列が URL 表現であるかどうか調べ、その結果を返す。
 * 出典: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
 * @param {String} str URL 表現であるかどうか調べたい文字列
 * @returns {Boolean} 引数で指定された文字列が URL 表現であれば true、さもなければ false
 */
const isUrl = function(str) {
	console.log(str);
	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	return pattern.test(str);
};

const logError = (err) => {
	log('[Error occurred in Crawls Router]');
	log(err);
};

/* GET crawls listing. */
router.get('/', (req, res) => {
	db.crawls.find({}, (err, crawls) => {
		if(err) {
			logError(err);
			res.status(500).res('Sorry, internal server error occurred. (500)');
		} else {
			res.send(crawls);
		}
	})
});

/* GET individual crawl data */
router.get('/:location', (req, res) => {
	db.crawls.findOne({location:req.params.location}, (err, found) => {
		if(err) {
			logError(err);
			res.status(500).res('Sorry, internal server error occurred. (500)');
		} else {
			if(found === null) {res.status(404).send('Not found. (404)');}
			else {res.send(found);}
		}
	});
});

/* POST crawl data */
router.post('/', async (req, res) => {
	const isInvalidBody = (() => {
		if(!req.body.location) {return true;}
		else if(!isUrl(decodeURIComponent(req.body.location))) {return true;}
		return false;
	})();
	if(isInvalidBody) {
		res.status(400).send('Please confirm your POST parameters is valid structure. (400)');
	} else {
		const decodedUrl = decodeURIComponent(req.body.location);
		const fetchedData = await fetch(decodedUrl);
		db.crawls.findOne({location:decodedUrl}, async (err, found) => {
			if(err) {
				logError(err);
				res.status(500).res('Sorry, internal server error occurred. (500)');
			} else {
				if(found === null) {
					db.crawls.insert({location:decodedUrl, html:fetchedData.body}, err => {
						if(err) {
							logError(err);
							res.status(500).res('Sorry, internal server error occurred. (500)');
						} else {
							res.send(`Successfully crawled "${decodedUrl}".`);
						}
					});
				} else {
					db.crawls.update({location:decodedUrl}, {$set:{html:fetchedData.body}}, err => {
						if(err) {
							logError(err);
							res.status(500).res('Sorry, internal server error occurred. (500)');
						} else {
							res.send(`Successfully crawled "${decodedUrl}".`);
						}
					});
				}
			}
		});
	}
});

module.exports = router;