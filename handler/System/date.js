


$($)



.add(function time(format) {

	return timeFormat(Date.now(), format)
})



Number.prototype.time =
String.prototype.time = function(format) {

	return timeFormat(this, format)
}



let past = {

	get: function() {

		return this.time() < $.time()
	}
}

Object.defineProperty(Number.prototype, 'past', past)
Object.defineProperty(String.prototype, 'past', past)



let left = {

	get: function() {

		let now = $.time()
		let timestamp = this.time()

		let seconds = timestamp > now ? timestamp - now : now - timestamp



		let d = Math.floor(seconds / 86400)
		let sec = Math.floor(seconds - d * 86400)

		let h = Math.floor(sec / 60 / 60)
		let m = Math.floor(sec / 60 - h * 60)
		let s = Math.floor(sec % 60)



		let date = []

		if (d > 0) {

			if (d > 0) date.push(`${d} д`)
			if (h > 0) date.push(`${h} ч`)

		} else if (h > 0) {

			if (h > 0) date.push(`${h} ч`)
			if (m > 0) date.push(`${m} мин`)

		} else {

			if (m > 0) date.push(`${m} мин`)
			if (s > 0) date.push(`${s} сек`)
		}

		return date.join(' ')
	}
}

Object.defineProperty(Number.prototype, 'left', left)
Object.defineProperty(String.prototype, 'left', left)










function timeFormat(timestamp, format) {



	const t = 1000000000

	let absolute = Math.abs(timestamp - t) > Math.abs(timestamp - t * 1000)

	let seconds = absolute ? parseInt(timestamp / 1000) : parseInt(timestamp)

	if (! format) return seconds

	let milliseconds = ! absolute ? parseInt(timestamp * 1000) : parseInt(timestamp)



	let date = new Date(parseInt(milliseconds))
	let locale = (o, s = -2) => ('0' + date.toLocaleString('ru', o)).slice(s)



	switch (format) {

		case 'sec': return seconds
		case 'ms': return milliseconds

		case 'midnight':
			date.setHours(0)
			date.setMinutes(0)
			date.setSeconds(0)
			date.setMilliseconds(0)
		return timeFormat(date.getTime())

		case 'short':
			format = 'h:m, D.M.Y'
		break

		case 'long':
			format = 'h:m:s, D.M.Y'
		break
	}



	return format

	.replace('msec', locale({ fractionalSecondDigits: 3 }, -3))
	.replace('sec', seconds)
	.replace('ms', milliseconds)

	.replace('h', locale({ hour: '2-digit' }))
	.replace('m', locale({ minute: '2-digit' }))
	.replace('s', locale({ second: '2-digit' }))

	.replace('W', date.toLocaleString('ru', { weekday: 'long' }).tU)
	.replace('MO', date.toLocaleString('ru', { month: 'long' }).tU)

	.replace('D', locale({ day: '2-digit' }))
	.replace('M', locale({ month: '2-digit' }))
	.replace('Y', date.getFullYear())
}
