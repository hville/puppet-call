const call = require('../call'),
			html = require('../html'),
			ct = require('cotest')

ct.timeout(7000)

ct('callBrowser', async end => {
	ct('!!', await testPage({
		route: {'/': html({body: 'x'})}
	},
	'document.body.textContent==="x"'
	))
	ct('!!', await testPage({
		route: {'/': html({script: 'var x = "x"'})}
	},
	'x==="x"'
	))
	ct('!!', await testPage({
		route: {
			'/': html({js: 'js.js'}),
			'/js.js': 'var x = "x"'
		}
	},
	'window.x === "x"'
	))
	ct('!!', await testPage({
		route: {
			'/': html({js: '/js.js'}),
			'/js.js': 'var x = "x"'
		}
	},
	'window.x === "x"'
	))
	ct('!!', await testPage({
		route: {
			'/': html({module: '/module.js'}),
			'/module.js': 'window.x = "x"'
		}
	},
	'window.x === "x"'
	))
	ct('!!', await testPage({
		root: '../',
		route: {
			'/': html({module: '/module.js'}),
			'/module.js': `
				import {e, Names} from '/lib/list-eNames.js'
				window.x = e + Names
			`
		}
	},
	'window.x === "eNames"'
	))
	ct('!!', await testPage({
		route: {
			'/': html({js: '/js.js'}),
			'/js.js': `const x = new Promise((done, fail) => {
										const wrk = new Worker("wrk.js")
										wrk.onmessage = e => done(e.data)
										wrk.onerror = e => fail(e.message)
										wrk.postMessage("x")
				})`,
			'/wrk.js': 'self.onmessage = ( e => self.postMessage(e.data) )'
		}},
	'x.then(val => val === "x")'
	))
	end()
})

function testPage(server, assert) {
	return call({server},
		page => page.evaluate(assert)
	)
}
