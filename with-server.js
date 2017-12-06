const	http = require('http'),
			URL = require('url'),
			fs = require('fs'),
			PATH = require('path'),
			wrap = require('./src/wrap')

const mime = {
	txt: 'text/plain',
	htm: 'text/html',
	html: 'text/html',
	css: 'text/css',
	js: 'text/javascript',
}

/**
 * @param {Object} options
 * @param {function({host, port, root, origin})} action
 * @return {Promise}
 */
module.exports = function(options, action) {
	const host = options.host || 'localhost', // 127.0.0.1
				port = options.port || 8080,
				root = options.root ? PATH.resolve(PATH.dirname(module.parent.filename), options.root) : '',
				routes = Object.assign({'/': '<!DOCTYPE html>'}, options.routes),
				srvr = createServer(routes, root),
				socks = new Set()

	srvr.on('connection', socket => {
		socks.add(socket)
		socket.once('close', () => socks.delete(socket))
	})

	function unwind() {
		return new Promise(done => {
			socks.forEach(s => s.destroy)
			socks.clear()
			srvr.close(done)
		})
	}

	return wrap(
		new Promise( (done, fail) => srvr.listen(port, host, err =>
			err? fail(err) : done({ host, port, root, origin: `http://${host}:${port}` }))),
		action,
		unwind
	)
}

function createServer(routes, root) {
	const srvr = http.createServer((request, response) => {
		const path = URL.parse(request.url).pathname,
					type = path === '/' ? mime.html : mime[PATH.extname(path).slice(1)]
		if (routes[path]) return getDone(response, routes[path], type)
		if (!root) return getFail(response, `File not found: ${path}`, 404)

		fs.readFile(PATH.join(root, path), 'utf8', function(err, data) {
			if (err) getFail(response, `File not found: ${path} in ${root}`, 404)
			else getDone(response, data, type)
		})
	})
	return srvr
}

function getDone(response, data, type) {
	response.setHeader('Content-Type', type)
	response.end(data)
}

function getFail(response, message, statusCode) {
	response.statusCode = statusCode
	response.end(message)
}
