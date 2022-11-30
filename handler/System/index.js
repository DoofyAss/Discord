


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
		if (this.object instanceof Object)
		this.object[name] = fn

		return this
	}



	get(a, b) {

		let [ name, fn ] = b ? [ a, b ] : [ a.name, a ]

		if (fn instanceof Function && name)
		if (this.object instanceof Object)
		Object.defineProperty(this.object, name, { get: fn })

		return this
	}
}










$($)



.add(function random(min, max) {

	[min, max] = max ? [min, max] : [0, min]
	return Math.floor(Math.random() * (max - min + 1)) + min
})










require('./console')
require('./common')
require('./date')

// require('./timer')