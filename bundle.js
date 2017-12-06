const rollup = require( 'rollup' ),
			resolve = require('rollup-plugin-node-resolve'),
			commonjs = require('rollup-plugin-commonjs'),
			PATH = require('path')

const exportOptions = {
	format: 'iife',
	extend: true,
	exports: 'named',
	name: 'exports'
}

const plugins = [
	resolve(), 	//defaults: { module: true, jsnext:false, main:true, browser:false, extensions: ['js'] }
	commonjs()
]

module.exports = async function bundle(f) {
	//@ts-ignore
	const bndl = await rollup.rollup({
		input: PATH.resolve(PATH.dirname(module.parent.filename), f),
		plugins: plugins
	})
	const {code,} = await bndl.generate(exportOptions)
	return code
}
