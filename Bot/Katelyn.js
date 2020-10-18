


const { lib } = require('./lib/lib.js')
const { DataBase, DB } = require('./DataBase')
const { bot, server, channel } = require('./config')



let Member = new Map()

DB('discord.member').fetch(members => {

	members.forEach(member => Member.set(member.id, Object.assign({}, member)))

	console.log(Member)
})
