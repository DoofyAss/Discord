


console.log()

console.color = function() {

	let date = $.time('long')

	let text = ` [ ${ date } ]  → ` +
	Array.prototype.join.call(arguments, ' ')

	console.log(text)
}

console.err = (...a) => console.color('\x1b[31m', ...a, '\x1b[0m')
console.ok = (...a) => console.color('\x1b[32m', ...a, '\x1b[0m')
console.warn = (...a) => console.color('\x1b[33m', ...a, '\x1b[0m')
console.info = (...a) => console.color('\x1b[34m', ...a, '\x1b[0m')
