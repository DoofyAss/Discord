


let lib = {



	random(min, max) {

		[min, max] = max ? [min, max] : [0, min]
		return Math.floor(min + Math.random() * (max + 1 - min))
	},



	date(timestamp) {

		let date = new Date(parseInt(timestamp)) // php timestamp * 1000

		let year = date.toLocaleString('ru', { year: 'numeric' })
		let month = date.toLocaleString('ru', { month: '2-digit' })
		let day = date.toLocaleString('ru', { day: '2-digit' })

		let hour = date.toLocaleString('ru', { hour: '2-digit' })
		let minute = ('0' + date.toLocaleString('ru', { minute: '2-digit' })).slice(-2)

		return `${day}.${month}.${year}`
	},



	time(timestamp) {

		let date = new Date(parseInt(timestamp)) // php timestamp * 1000

		let year = date.toLocaleString('ru', { year: 'numeric' })
		let month = date.toLocaleString('ru', { month: '2-digit' })
		let day = date.toLocaleString('ru', { day: '2-digit' })

		let hour = date.toLocaleString('ru', { hour: '2-digit' })
		let minute = ('0' + date.toLocaleString('ru', { minute: '2-digit' })).slice(-2)

		return `${hour}:${minute}, ${day}.${month}.${year}`
	},



	timestamp(date) {

		return new Date(date).getTime()
	},



	became(milisec) {

		let d = Math.floor(milisec / 86400000)
		let sec = Math.floor(milisec / 1000 - d * 86400)

		let h = Math.floor(sec / 60 / 60)
		let m = Math.floor(sec / 60 - h * 60)
		let s = Math.floor(sec % 60)

		return [

			(d ? `${d} д` : ''),
			(h ? `${h} ч` : ''),
			(m ? `${m} мин` : ''),
			// (s ? `${s}сек` : '')

		].join(' ').replace(/ +/g, ' ').trim()
	}
}










/*
	['a', 'b', 'c'].random
	return any of array item
*/

Object.defineProperty(Array.prototype, 'random', {

    get: function() {

		return this[ Math.floor( Math.random() * this.length ) ]
	}
})



Object.defineProperty(Number.prototype, 'date', {

    get: function() {

		return lib.date(this)
	}
})



Object.defineProperty(String.prototype, 'date', {

    get: function() {

		return lib.date(this)
	}
})



Object.defineProperty(Number.prototype, 'time', {

    get: function() {

		return lib.time(this)
	}
})



Object.defineProperty(String.prototype, 'time', {

    get: function() {

		return lib.time(this)
	}
})



Object.defineProperty(Number.prototype, 'became', {

    get: function() {

		return lib.became(this)
	}
})



Object.defineProperty(String.prototype, 'became', {

    get: function() {

		return lib.became(this)
	}
})










module.exports = { lib }
