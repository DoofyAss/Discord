


global.fs = require('fs')
global.path = require('path')



const child_process = require('child_process')
global.exec = child_process.exec



global.audioDuration = async file => {

	let arg = '-show_entries format=duration -v quiet -of csv="p=0"'

	return new Promise(resolve => {

		exec(`ffprobe -i ${ file } ${ arg }`, (err, output) =>
		resolve(output.trim()))
	})
}



global.audioWaveform = async file => {

	let arg = `"amovie=${ file },asetnsamples=22000,astats=metadata=1:reset=1" -show_entries frame_tags=lavfi.astats.Overall.RMS_level -of csv=p=0`

	return new Promise(resolve => {

		exec(`ffprobe -v error -f lavfi -i ${ arg }`, (err, output) => {

			let data = output.split('\r\n').filter(e => e)
			.map(e => parseInt(Math.abs(e)))

			// let max = Math.max(...data)
			// data = data.map(e => parseInt(255 / ( max / e )))

			resolve(btoa(JSON.stringify(data)))
		})
	})
}



require('./System')
require('./Client')
require('./SQL')



module.exports = callback => callback()



process.on('uncaughtException', exception => console.log(exception))
