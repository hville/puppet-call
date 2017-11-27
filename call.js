// @ts-check
const puppeteer = require('puppeteer'),
			PATH = require('path'),
			serve = require('./serve')

/**
 * @param {Object} options
 * @param {Function} nodeFunc
 * @return {Promise}
 */
module.exports = function call(options, nodeFunc) {
	const serverCfg = options && options.server,
				browserCfg = (options && options.browser) || {},
				browserPr = puppeteer.launch(browserCfg)
	if (serverCfg && serverCfg.root) serverCfg.root = PATH.resolve(PATH.dirname(module.parent.filename), serverCfg.root)

	return Promise.all([
		serverCfg ? serve(serverCfg) : Promise.resolve(null),
		browserPr,
		browserPr.then(br => br.newPage()),
		browserCfg.headless !== false && !browserCfg.devtools !== false,
		nodeFunc
	]).then(runner)
}

async function runner([server, browser, page, headless, handler]) {
	const closedPr = new Promise( done => browser.on( 'disconnected', () => done( server && server.stop() ) ) )
	if (server) await page.goto(`http://${server.host}:${server.port}`)
	const result = await handler.call(browser, page)
	if (headless) await browser.close()
	await closedPr
	return result
}
