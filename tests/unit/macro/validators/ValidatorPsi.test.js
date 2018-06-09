// ツール取得
const options = require('../../../../options.js');
const test = require('ava');
const ValidatorPsi = require('../../../../macro/validators/ValidatorPsi.js');

// テスト用データ
const desktopResultValid = {ruleGroups: {SPEED: {score: options.validation.psi.speedThreshold.desktop}}};
const desktopResultInvalid = {ruleGroups: {SPEED: {score: options.validation.psi.speedThreshold.desktop - 1}}};
const mobileResultValid = {ruleGroups: {SPEED: {score: options.validation.psi.speedThreshold.mobile}}};
const mobileResultInvalid = {ruleGroups: {SPEED: {score: options.validation.psi.speedThreshold.mobile - 1}}};
const v = new ValidatorPsi();




// テスト実行
test('デスクトップのスピードスコアが合格ラインを下回っていれば不合格とみなす', t => t.false(v.validate(desktopResultInvalid, mobileResultValid).isValid()));
test('モバイルのスピードスコアが合格ラインを下回っていれば不合格とみなす', t => t.false(v.validate(desktopResultValid, mobileResultInvalid).isValid()));
test('デスクトップとモバイル共に合格ラインを満たしていれば合格とみなす', t => t.true(v.validate(desktopResultValid, mobileResultValid).isValid()));