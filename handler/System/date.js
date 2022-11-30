


$($)



.add(function time(format) {

	return timeFormat(Date.now(), format)
})



Number.prototype.time =
String.prototype.time = function(format) {

	return timeFormat(this, format)
}










function timeFormat(timestamp, format) {



	const t = 1000000000

	let absolute = Math.abs(timestamp - t) > Math.abs(timestamp - t * 1000)

	let seconds = absolute ? parseInt(timestamp / 1000) : timestamp

	if (! format) return seconds

	let milliseconds = ! absolute ? parseInt(timestamp * 1000) : timestamp



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

	.replace('W', date.toLocaleString('ru', { weekday: 'long' }).fU)
	.replace('MO', date.toLocaleString('ru', { month: 'long' }).fU)

	.replace('D', locale({ day: '2-digit' }))
	.replace('M', locale({ month: '2-digit' }))
	.replace('Y', date.getFullYear())
}
