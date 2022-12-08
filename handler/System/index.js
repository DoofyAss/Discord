


global.$ = function(object) {

	return new System(object)
}



class System {



	constructor(object) {

		this.object = object
	}



	add(a, b) {

		let [ name, fn ] = b ? [ a, b ] : [ a.name, a ]

		if (fn instanceof Function && name)
		this.object[name] = fn

		return this
	}



	get(a, b) {

		let [ name, fn ] = b ? [ a, b ] : [ a.name, a ]

		Object.defineProperty(this.object, name,
		fn instanceof Function ? { get: fn } : { get: () => fn })

		return this
	}
}










$($)



.add(function size(bytes, decimal = 2) {

	if (! bytes) return '0 Bytes'

	const k = 1024 // 1000 for bits
	const s = ['Bytes', 'KB', 'MB', 'GB', 'TB']
	const d = decimal < 0 ? 0 : decimal

	const i = Math.floor( Math.log(bytes) / Math.log(k) )

	return parseFloat((bytes / Math.pow(k, i)).toFixed(d)) + ` ${ s[i] }`
})



.add(function random(min, max) {

	[ min, max ] = max ? [ min, max ] : [ 0, min ]
	return Math.floor(Math.random() * (max - min + 1)) + min
})










require('./console')
require('./common')
require('./timer')
require('./date')










process.argv.filter(arg => arg.startsWith('--')).forEach(string => {

	let index = process.argv.indexOf(string)
	let value = index > -1 ? process.argv[index + 1] : null

	if (value)
	$[string.replace('--', '__')] = value
})
