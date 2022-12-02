


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

		if (fn instanceof Function && name)
		Object.defineProperty(this.object, name, { get: fn })

		return this
	}
}










$($)



.add(function random(min, max) {

	[ min, max ] = max ? [ min, max ] : [ 0, min ]
	return Math.floor(Math.random() * (max - min + 1)) + min
})










require('./console')
require('./common')
require('./timer')
require('./date')
