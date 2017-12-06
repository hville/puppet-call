const withPuppet = require('../with-puppet'),
			ct = require('cotest')

ct.timeout(10000)

ct('close on resolved action', async end => {
	ct('===', await withPuppet( {}, () => 'return'), 'return')
	ct('===', await withPuppet( {}, () => Promise.resolve('Promise')), 'Promise')
	ct('===', await withPuppet( {}, () => new Promise(done => setImmediate(done, 'setImmediate')) ), 'setImmediate')
	ct('===', await withPuppet( {}, () => new Promise(done => process.nextTick(done, 'nextTick')) ), 'nextTick')
	ct('===', await withPuppet( {headless: false}, puppet => {puppet.close(); return 'windowed'}), 'windowed')
	end()
})

ct('close on rejected action', async end => {
	ct('===', await withPuppet( {}, () => {throw 'return'}).catch(e=>e), 'return')
	ct('===', await withPuppet( {}, () => Promise.reject('Promise')).catch(e=>e), 'Promise')
	ct('===', await withPuppet( {}, () => new Promise( (done,fail) => setImmediate(fail, 'setImmediate')) ).catch(e=>e), 'setImmediate')
	ct('===', await withPuppet( {}, () => new Promise( (done,fail) => process.nextTick(fail, 'nextTick')) ).catch(e=>e), 'nextTick')
	end()
})
