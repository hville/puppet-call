// @ts-check
const withPuppet = require('./with-puppet')

/**
 * @param {string} origin
 * @param {string | Function} pageAction
 * @param {Object} [config]
 * @return {Promise}
 */
module.exports = function pager(origin, pageAction, config) {
	return withPuppet(config, puppet => {
		return puppet.newPage().then(page => {
			page.on('console', msg => console.log(msg.text))
			return origin
				? page.goto(origin).then(() => page.evaluate(pageAction))
				: page.evaluate(pageAction)
		})
	})
}
