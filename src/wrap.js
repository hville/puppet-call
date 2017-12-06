/**
 * @param {Promise} init
 * @param {function(*)} then
 * @param {function(*)} exit
 * @return {Promise}
 */
module.exports = function(init, then, exit) {
	const result = init.then(then)
	return result.then(
		() => init.then(exit).then(() => result),
		() => init.then(exit).then(() => result)
	)
}
