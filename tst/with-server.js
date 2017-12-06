const serve = require('../with-server'),
			ct = require('cotest')

ct.timeout(10000)

ct('close on resolved action', async end => {
	ct('===', await serve({}, () => Promise.resolve('Promise')), 'Promise')
	ct('===', await serve({}, () => new Promise(done => setImmediate(done, 'setImmediate')) ), 'setImmediate')
	ct('===', await serve({}, () => new Promise(done => process.nextTick(done, 'nextTick')) ), 'nextTick')
	end()
})

ct('close on rejected action', async end => {
	ct('===', await serve({}, () => { throw 'return' }).catch(e=>e), 'return')
	ct('===', await serve({}, () => Promise.reject('Promise')).catch(e=>e), 'Promise')
	ct('===', await serve({}, () => new Promise( (done,fail) => setImmediate(fail, 'setImmediate')) ).catch(e=>e), 'setImmediate')
	ct('===', await serve({}, () => new Promise( (done,fail) => process.nextTick(fail, 'nextTick')) ).catch(e=>e), 'nextTick')
	end()
})
