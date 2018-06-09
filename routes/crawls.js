// ツール読込
const express = require('express');
const db = require('../macro/db.js');
const fetch = require('../macro/fetch.js');
const isUrl = require('../macro/isUrl.js');
const log = require('../macro/log.js');
const router = express.Router();

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