const puppeteer = require('puppeteer'),
			wrap = require('./src/wrap')

/**
 * @param {Object} options
 * @param {function(object)} puppetAction
 * @return {Promise}
 */
module.exports = function(options = {}, puppetAction) {
	return puppeteer.launch(options).then( browser => {
		const headless = options.headless !== false && !options.devtools !== false,
					closed = new Promise( done => browser.on( 'disconnected', done ) )

		function unwind() {
			return headless ? browser.close() : closed
		}

		return wrap(
			Promise.resolve(browser),
			puppetAction,
			unwind
		)
	})
}
