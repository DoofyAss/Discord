


const { DB } = require('./DataBase')
const { server, channel, config } = require('./config')

DB('discord.user')
.where('id', 1)
// .update('name', 'qeqqe')
.update({ id: 1, name: 'qeqqe' })
.catch(console.log)
