


const { lib } = require('./lib/lib.js')
const { DataBase, DB } = require('./DataBase')
const { bot, server, channel } = require('./config')



const Member = {



	handler: {

		get: function(target, name) { return target[name] },

		set: async function(target, name, value) {

			target[name] = value
			DataBase.member.update(target.id, { [name]: value })
		}
	},



	get: async function(id, callback) {

		let data = await DataBase.member.get(id)

		if (data) {

			let proxy = new Proxy(data, this.handler)

			if (callback) callback(proxy)
			return proxy
		}
	}
}





Member.get('1', member => member.experience += 20)
