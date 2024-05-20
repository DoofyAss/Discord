


const MySQL = require('mysql')



const mysql = {

	connect() {



		this.connection = MySQL.createConnection({

			host: '127.0.0.1', user: 'root', charset: 'utf8mb4'
		})



		this.connection.connect(err => {

			if (err) {

				if (this.err != err.code)
				console.err('DB', this.err = err.code)

				return setTimeout(() => this.connect(), 5000)
			}

			this.err = false
			console.ok('DB connected')
		})



		this.connection.on('error', err => this.connect())
	}
}

mysql.connect()







$(DB).get(async function connection() {

	return await new Promise(resolve => {

		let interval = () => {

			if (mysql.connection.state == 'authenticated')
			return resolve(mysql.connection)

			setTimeout(interval, 250)
		}

		interval()
	})
})
