


module.exports = [

{
	name: 'general',
	description: 'Общая категория',
	cooldown: { time: 5000 },
	allow: [ config.roles.Developer ],

	options: [

		{
			name: 'update_permissions',
			description: 'Назначить каждому каналу права из категории',
			type: 1, // SUB_COMMAND
		},
		{
			name: 'delete_channels',
			description: 'Удалить все каналы',
			type: 1, // SUB_COMMAND
		},
		{
			name: 'init',
			description: 'Инициализация каналов',
			type: 1, // SUB_COMMAND
		},
	],



	async update_permissions() {

		await this.interaction.deferReply({ ephemeral: true })
		await General.updatePermissions()
	},

	async delete_channels() {

		await this.interaction.deferReply({ ephemeral: true })
		await General.deleteChannels()
	},

	async init() {

		await this.interaction.deferReply({ ephemeral: true })
		await General.init()
	}
}

]
