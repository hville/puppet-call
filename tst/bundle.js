const withServer = require('@hugov/test-server'),
			withPage = require('../with-page'),
			ct = require('cotest'),
			bundle = require('@hugov/cjs-to-iife')

ct.timeout(10000)

ct('bundled script', async end => {
	const code = await bundle('../node_modules/cotest/index.js')
	const scfg = {routes:{
		'/': `
			<!DOCTYPE html>
			<script src="x.js"></script>
		`,
		'/x.js': code
	}}
	ct('===', await withServer(scfg, info => withPage(info.origin, function() { return typeof exports['default'] })), 'function')
	end()
})
