/**
 * バリデーション挙動の設定です。
 * @type {{validation: {psi: {speedThreshold: {desktop: number, mobile: number}}}}}
 */
module.exports = {
	validation: {
		psi: {
			speedThreshold: {
				desktop: 60, // スピードスコアがこの値以上であれば合格とみなす
				mobile: 60 // スピードスコアがこの値以上であれば合格とみなす
			}
		}
	}
};