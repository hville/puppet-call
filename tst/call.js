const call = require('../call'),
			ct = require('cotest')

ct.timeout(7000)

ct('callPuppet', async end => {
	ct('!!', await call(null, justTrue))
	ct('!!', await call({browser: {headless: false}}, closeAndTrue))
	ct('!!', await call({server: {root: './'}, browser:{headless: false}}, closeAndTrue))
	ct('!!', await call({server: {root: './'}}, justTrue))
	end()
})

function justTrue() {
	return true
}

function closeAndTrue() {
	this.close().catch(e => console.log(e.message))
	return true
}
