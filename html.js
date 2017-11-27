/*
	script: inline script(s)
	style:  inline style(s)
	js:     linked external script(s)
	css:    linked external style(s)
	module: linked external module(s)
	title:  page title
	body:   inline tag(s)
*/

module.exports = function html(contents = {}) {
	return '<!DOCTYPE html>'.concat(
		tag`<head>${[
			tag`<title>${contents.title}</title>`,
			tags`<link rel=stylesheet href="${contents.css}">`,
			tags`<style>${contents.style}</style>`,
			tags`<script src="${contents.js}"></script>`,
			tags`<script type="module" src="${contents.module}"></script>`,
			tags`<script>${contents.script}</script>`
		]}</head>`,
		tag`<body>${contents.body}</body>`
	)
}

function tag(strings, content) {
	return !content ? '' : strings[0] + (Array.isArray(content) ? content.join('') : content) + strings[1]
}

function tags(strings, content) {
	return Array.isArray(content) ? content.map(str => tag(strings, str)).join('') : tag(strings, content)
}
