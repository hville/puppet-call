const withServer = require('../with-server'),
			withPage = require('../with-page'),
			ct = require('cotest')

ct.timeout(10000)

ct('blank page', async end => {
	ct('===', await withPage(null, '"null"'), 'null')
	ct('===', await withPage('', '"empty"'), 'empty')
	end()
})

ct('page and script', async end => {
	const scfg = {routes:{
		'/': `
			<!DOCTYPE html>
			<script src="x.js"></script>
			<body>page</body>
		`,
		'/x.js': `
			const x = true
		`
	}}
	ct('===', await withServer(scfg, info => withPage(info.origin, 'document.body.textContent.trim()')), 'page')
	ct('===', await withServer(scfg, info => withPage(info.origin, 'x ? "script" : "fail"')), 'script')
	end()
})

ct('DOM ops', async end => {
	const scfg = {routes:{
		'/': `
			<!DOCTYPE html>
			<body></body>
			<script src="x.js"></script>
		`,
		'/x.js': `
			document.body.textContent = "DOM"
		`
	}}
	ct('===', await withServer(scfg, info => withPage(info.origin, 'document.body.textContent.trim()')), 'DOM')
	end()
})

ct('worker', async end => {
	const scfg = {routes:{
		'/': `
			<!DOCTYPE html>
			<script src="x.js"></script>
		`,
		'/x.js': `
			const workerPromise = new Promise((done, fail) => {
				const wrk = new Worker("wrk.js")
				wrk.onmessage = e => done(e.data)
				wrk.onerror = e => fail(e.message)
				wrk.postMessage("worker")
			})
		`,
		'/wrk.js': 'self.onmessage = ( e => self.postMessage(e.data) )'
	}}
	ct('===', await withServer(scfg, info => withPage(info.origin, 'workerPromise')), 'worker')
	end()
})

ct.skip('module', async end => {
	const scfg = {routes:{
		'/': `
			<!DOCTYPE html>
			<script type="module" src="m.js"></script>
		`,
		'./m.js': 'window.shared = "module"'
	}}
	ct('===', await withServer(scfg, info => withPage(info.origin, 'window.shared')), 'module')
	end()
})

ct.skip('module', async end => {
	const scfg = {routes:{
		'/': `
			<!DOCTYPE html>
			<script type="module" src="m.js"></script>
		`,
		'./m.js': `
			import exp from "./e.js"
			window.exported = exported
		`,
		'./e.js': 'console.log("EEEEEEEEEEe"); export default "module"'
	}}
	ct('===', await withServer(scfg, info => withPage(info.origin, 'window.exp')), 'module')
	end()
})
