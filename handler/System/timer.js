


const List = []



$(global.Timer = function Timer(anchor) {

	return Timer.find(anchor) || new TIMER(anchor)
})



.get(function list() {

	return List
})



.add(function find(anchor) {

	return List.find(e =>
	anchor.map((k, v) => v == e.anchor[k]).every(Boolean))
})



.add(function remain(anchor) {

	return this.find(anchor)?.remain || 0
})



.add(function destroy(anchor) {

	return this.find(anchor)?.destroy()
})



.add(function restart(anchor) {

	return this.find(anchor)?.restart()
})



.add(function filter(anchor) {

	return List.filter(e =>
	anchor.map((k, v) => v == e.anchor[k]).every(Boolean))
})



class TIMER {



	constructor(anchor) {

		this.anchor = anchor
		this.data = {}
	}



	get remain() {

		let now = Date.now()
		let remain = this.expiry - now

		return remain > 0 ? remain : 0
	}



	get left() {

		return (this.remain + Date.now()).left
	}



	complete() {

		this.destroy()
		this.callback?.call(this, this)
	}



	start(duration, callback) {

		if (this.remain) return this

		duration && (this.duration = duration)
		callback && (this.callback = callback)

		this.begin = Date.now()
		this.expiry = Date.now() + this.duration

		this.timeout = setTimeout(() => this.complete(), this.duration)

		List.push(this)

		return this
	}



	restart(duration, callback) {

		clearTimeout(this.timeout)

		duration && (this.duration = duration)
		callback && (this.callback = callback)

		this.begin = Date.now()
		this.expiry = Date.now() + this.duration

		this.timeout = setTimeout(() => this.complete(), this.duration)

		return this
	}



	destroy() {

		clearTimeout(this.timeout)
		List.splice(List.indexOf(this), 1)
		return this
	}



	push(data) {

		Object.assign(this.data, data)
		return this
	}
}
