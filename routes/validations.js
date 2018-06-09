// ツール読込
const express = require('express');
const db = require('../macro/db.js');
const isUrl = require('../macro/isUrl.js');
const keys = require('../keys.js');
const log = require('../macro/log.js');
const router = express.Router();
const ValidatorDeadLink = require('../macro/validators/ValidatorDeadLink.js');
const ValidatorPsi = require('../macro/validators/ValidatorPsi.js');
const ValidatorW3c = require('../macro/validators/ValidatorW3c.js');

// バリデータインスタンスの生成
const validatorDeadLink = new ValidatorDeadLink();
const validatorPsi = new ValidatorPsi();
const validatorW3c = new ValidatorW3c();

const logError = (err) => {
	log('[Error occurred in Validations Router]');
	log(err);
};

const saveValidateResult = (location, key, validationResult) => {
	return new Promise((resolve, reject) => {
		db.validations.findOne({location: location}, async(err, found) => {
			if(err) {
				reject(err);
			} else {
				if(found === null) {
					const newRecord = {location: location};
					newRecord[key] = {isValid: validationResult.isValid(), messages: validationResult.getMessages()};
					db.validations.insert(newRecord, err => {
						if(err) {reject(err);}
						else {resolve();}
					});
				} else {
					const setObj = {};
					setObj[key] = {isValid: validationResult.isValid(), messages: validationResult.getMessages()};
					db.validations.update({location: location}, {$set: setObj}, err => {
						if(err) {reject(err);}
						else {resolve();}
					});
				}
			}
		});
	});
};

/* GET validation result listing. */
router.get('/', (req, res) => {
	db.validations.find({}, (err, validations) => {
		if(err) {
			logError(err);
			res.status(500).res('Sorry, internal server error occurred. (500)');
		} else {
			res.send(validations);
		}
	})
});

/* GET individual validation result data */
router.get('/:location', (req, res) => {
	db.validations.findOne({location: req.params.location}, (err, found) => {
		if(err) {
			logError(err);
			res.status(500).res('Sorry, internal server error occurred. (500)');
		} else {
			if(found === null) {res.status(404).send('Not found. (404)');}
			else {res.send(found);}
		}
	});
});

/* Execute validations */
router.post('/:location', async(req, res) => {
	const isInvalidBody = (() => {
		if(!req.params.location) {return true;}
		else if(!isUrl(decodeURIComponent(req.params.location))) {return true;}
		return false;
	})();
	if(isInvalidBody) {
		res.status(400).send('Please confirm your POST parameters is valid structure. (400)');
	} else {
		const decodedUrl = decodeURIComponent(req.params.location);
		db.crawls.findOne({location: decodedUrl}, async(err, found) => {
			if(err) {
				logError(err);
				res.status(500).res('Sorry, internal server error occurred. (500)');
			} else {
				if(found === null) {res.status(404).send('The location not crawled yet. Please crawl it in advance. (404)');}
				else {
					const validated = [];
					if(req.body.psi && req.body.psi === 'true') {
						const resultValidatePsi = await validatorPsi.validate(req.params.location, keys.googleApiKey);
						await saveValidateResult(decodedUrl, validatorPsi.getLabel(), resultValidatePsi).catch(err => {
							logError(err);
							res.status(500).res('Sorry, internal server error occurred. (500)');
						});
						validated.push(validatorPsi.getLabel());
					}
					if(req.body.w3c && req.body.w3c === 'true') {
						const resultValidateW3c = await validatorW3c.validate(found.html);
						await saveValidateResult(decodedUrl, validatorW3c.getLabel(), resultValidateW3c).catch(err => {
							logError(err);
							res.status(500).res('Sorry, internal server error occurred. (500)');
						});
						validated.push(validatorW3c.getLabel());
					}
					if(req.body.dead_link && req.body.dead_link === 'true') {
						const resultValidateDeadLink = await validatorDeadLink.validate(req.params.location, found.html);
						await saveValidateResult(decodedUrl, validatorDeadLink.getLabel(), resultValidateDeadLink).catch(err => {
							logError(err);
							res.status(500).res('Sorry, internal server error occurred. (500)');
						});
						validated.push(validatorDeadLink.getLabel());
					}
					if(validated.length > 0) {
						res.send(`Successfully validated "${decodedUrl}". (${validated})`);
					} else {
						res.status(400).send('Please specify validate menus. (400)');
					}
				}
			}
		});
	}
});

module.exports = router;