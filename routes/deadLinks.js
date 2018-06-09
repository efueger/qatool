// ツール読込
const express = require('express');
const db = require('../macro/db.js');
const log = require('../macro/log.js');
const router = express.Router();

const logError = (err) => {
	log('[Error occurred in DeadLinks Router]');
	log(err);
};

/* GET crawls listing. */
router.get('/', (req, res) => {
	db.deadLinks.find({}, (err, deadLinks) => {
		if(err) {
			logError(err);
			res.status(500).res('Sorry, internal server error occurred. (500)');
		} else {
			res.send(deadLinks);
		}
	})
});

router.delete('/', (req, res) => {
	db.deadLinks.remove({}, {multi: true}, (err, numRemoved) => {
		if(err) {
			logError(err);
			res.status(500).res('Sorry, internal server error occurred. (500)');
		} else {
			res.send(`Successfully deleted all dead link caches. (${numRemoved} items deleted)`);
		}
	});
});

module.exports = router;