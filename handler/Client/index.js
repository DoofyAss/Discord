

global.client = Object.assign(global.client || {})



$(client)



.add(function info() {

	setInterval(() => {

		let memory = process.memoryUsage()

		let data = [

			client.user ?. username || 'Bot',
			$.time('long'),
			$.size(memory.heapUsed)
		]

		process.title = data.join('   -   ')

	}, 1000)
})










.add(function scan(folder, collection = []) {

	folder = path.join(require.main.path, folder)



	const put = (module, dir) => {

		let name = (dir || module)
		.split(path.sep).pop()

		collection.push({ name: name, path: module })
	}



	fs.readdirSync(folder).forEach(dir => {

		let tmp = path.join(folder, dir)

		if (fs.lstatSync(tmp).isDirectory()) {

			let index = path.join(tmp, 'index.js')
			if (fs.existsSync(index)) put(index, tmp)
		}

		if (tmp.endsWith('.js')) put(tmp)
	})

	return collection
})
