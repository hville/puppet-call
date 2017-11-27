const	http = require('http')
const URL = require('url')
const fs = require('fs')
const PATH = require('path')

const mime = {
	txt: 'text/plain',
	htm: 'text/html',
	html: 'text/html',
	css: 'text/css',
	js: 'text/javascript',
}

module.exports = function serve(options) {
	return new Promise(listening => {
		const host = options.host || 'localhost', // 127.0.0.1
					port = options.port || 8080,
					root = options.root ? PATH.resolve(PATH.dirname(module.parent.filename), options.root) : '',
					route = Object.assign({'/': '<!DOCTYPE html>'}, options.route),
					socks = new Set()

		const srvr = http.createServer((request, response) => {
			const path = URL.parse(request.url).pathname,
						type = path === '/' ? mime.html : mime[PATH.extname(path).slice(1)]
			if (route[path]) return getDone(response, route[path], type)
			if (!root) return getFail(response, `File not found: ${path}`, 404)

			fs.readFile(PATH.join(root, path), 'utf8', function(err, data) {
				if (err) getFail(response, `File not found: ${path} in ${root}`, 404)
				else getDone(response, data, type)
			})
		})

		srvr.on('connection', socket => {
			socks.add(socket)
			socket.once('close', () => socks.delete(socket))
		})

		srvr.once('listening', () => listening({
			host, port, root,
			stop: () => new Promise(stopped => {
				socks.forEach(s => s.destroy)
				socks.clear()
				srvr.close(stopped)
			})
		}))

		srvr.listen(port, host)
	})
}

function getDone(response, data, type) {
	response.setHeader('Content-Type', type)
	response.end(data)
}

function getFail(response, message, statusCode) {
	response.statusCode = statusCode
	response.end(message)
}
