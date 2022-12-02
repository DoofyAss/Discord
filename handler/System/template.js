


/*
	Common
*/

$.random(min, max)
$.random(max) // 0, max

'String'.tL // first char to lowercase
'string'.tU // first char to uppercase



/*
	Map, Array, Object
*/

['a', 'b', 'c'].random
['a', 'b', 'c'].first // 'a'

[].null // null
['a'].null // ['a']

[].empty // true
{}.empty // true

Map.array // convert Map to Array

{}.map((key, value) => {})
{}.filter((key, value) => {})

Map.each((value, key, map) => {})
Array.each((value, index, arr) => {})
Object.each((key, value, object) => {})



/*
	Date, Timestamp

	h: hour
	m: minute
	s: second
	ms: millisecond

	sec: timestamp in seconds
	msec: timestamp in milliseconds

	D: Day
	M: Month
	Y: Year

	W: Weekday
	MO: Month long
*/

$.time() // timestamp Date now in seconds
$.time('ms') // timestamp Date now in milliseconds

$.time('short') // now - h:m, D.M.Y
$.time('long') // now - h:m:s, D.M.Y

$.time('h:m') // format now - h:m
timestamp.time('h:m') // format timestamp - h:m

timestamp.time() // convert milliseconds to seconds
timestamp.time('ms') // convert seconds to milliseconds
timestamp.time('midnight') // timestamp of 00:00:00 30.11.2022

timestamp.past // timestamp < now
timestamp.left // 1 h 30 min



/*
	Timer
*/

let timer = Timer({ id: 'anchor', member: 'id' }) // find or create

timer.start(2000, function onEnd() {})
timer.restart(duration, callback) // optional args
timer.destroy()

timer.remain // ms left
timer.left // remain format

timer.push({ channel: 64 })
timer.data.channel // 64

Timer.find({ id: 'anchor', member: 'id' })
Timer.remain({ id: 'anchor', member: 'id' })
Timer.restart({ id: 'anchor', member: 'id' })
Timer.destroy({ id: 'anchor', member: 'id' })
Timer.filter({ id: 'anchor' })
