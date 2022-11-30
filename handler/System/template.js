
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

$.time('h:m') // now - h:m
$.time('short') // now - h:m, D.M.Y
$.time('long') // now - h:m:s, D.M.Y

timestamp.time('h:m') // h:m

timestamp.time() // convert milliseconds to seconds
timestamp.time('sec') // convert milliseconds to seconds
timestamp.time('ms') // convert seconds to milliseconds

timestamp.time('midnight') // timestamp of 00:00:00 30.11.2022
