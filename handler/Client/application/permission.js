


$(application)



.add(function permission(data, member) {



	// Permission

	let permissions = Permission.filter((key, value) =>
	key & data.permission && ({

		have: key & parseInt(member.permissions.bitfield),
		name: value
	}))



	// Access

	let dataAccess = array => array.map(id => ({

		have: member._roles.includes(id) || member.id == id,
		data: client.guild.roles.cache.get(id) ? `<@&${id}>` : `<@${id}>`
	}))

	let allow = dataAccess(data.allow)
	let disallow = dataAccess(data.disallow)



	// Permit

	let permit = [

		permissions.map(e => e.have).every(Boolean),
		allow.empty ? true : allow.map(e => e.have).some(Boolean)
	]

	let deny = disallow.map(e => e.have).some(Boolean) || ! permit.every(Boolean)



	// list

	let list = {

		info: [],

		allow: allow.map(e => e.data).join(' '),
		disallow: disallow.map(e => e.data).join(' '),
		permission: permissions.map(e => `${ e.have ? '🗸' : '✗' } \u200b ${ e.name }`).join('\n')
	}

	list.allow && list.info.push(`Разрешено: ${ list.allow }`)
	list.disallow && list.info.push(`Запрещено: ${ list.disallow }`)

	list.info = [ list.info.join('\n'), list.permission ].join('\n\n')

	return deny ? list.info.trim() : false
})










const Permission = {

	[2 ** 0]:	'Создание приглашения', // 0x1
	[2 ** 1]:	'Выгонять участников', // 0x2
	[2 ** 2]:	'Банить участников', // 0x4
	[2 ** 3]:	'Администратор', // 0x8

	[2 ** 4]:	'Управлять каналами', // 0x10
	[2 ** 5]:	'Управлять сервером', // 0x20
	[2 ** 6]:	'Добавлять реакции', // 0x40
	[2 ** 7]:	'Просматривать журнал аудита', // 0x80

	[2 ** 8]:	'Приоритетный режим', // 0x100
	[2 ** 9]:	'Видео', // 0x200
	[2 ** 10]:	'Просматривать каналы', // 0x400
	[2 ** 11]:	'Отправлять сообщения', // 0x800

	[2 ** 12]:	'Отправка сообщений text-to-speech', // 0x1000
	[2 ** 13]:	'Управлять сообщениями', // 0x2000
	[2 ** 14]:	'Встраивать ссылки', // 0x4000
	[2 ** 15]:	'Прикреплять файлы', // 0x8000

	[2 ** 16]:	'Читать историю сообщений', // 0x10000
	[2 ** 17]:	'Упоминание ролей', // 0x20000
	[2 ** 18]:	'Использовать внешние эмодзи', // 0x40000
	[2 ** 19]:	'Просмотр аналитики сервера', // 0x80000

	[2 ** 20]:	'Подключаться', // 0x100000
	[2 ** 21]:	'Говорить', // 0x200000
	[2 ** 22]:	'Отключать участникам микрофон', // 0x400000
	[2 ** 23]:	'Отключать участникам звук', // 0x800000

	[2 ** 24]:	'Перемещать участников', // 0x1000000
	[2 ** 25]:	'Использовать режим активации по голосу', // 0x2000000
	[2 ** 26]:	'Изменить никнейм', // 0x4000000
	[2 ** 27]:	'Управлять никнеймами', // 0x8000000

	[2 ** 28]:	'Управлять ролями', // 0x10000000
	[2 ** 29]:	'Управлять вебхуками (webhooks)', // 0x20000000
	[2 ** 30]:	'Управлять эмодзи и стикерами', // 0x40000000
	[2 ** 31]:	'Использовать команды приложения', // 0x80000000

	[2 ** 32]:	'Попросить выступить', // 0x100000000
	[2 ** 33]:	'Управление событиями', // 0x200000000
	[2 ** 34]:	'Управление ветками', // 0x400000000
	[2 ** 35]:	'Создать публичные ветки', // 0x800000000

	[2 ** 36]:	'Создание приватных веток', // 0x1000000000
	[2 ** 37]:	'Использовать внешние стикеры', // 0x2000000000
	[2 ** 38]:	'Отправлять сообщения в ветках', // 0x4000000000
	[2 ** 39]:	'Использовать активности', // 0x8000000000

	[2 ** 40]:	'Выдать тайм-аут' // 0x10000000000
}