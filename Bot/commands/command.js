


module.exports = [

{
	name: 'command',
	description: 'command_description',
	cooldown: { time: 15000, member: new Map },
	permission: 0x1 | 0x2 | 0x4 | 0x8,

	options: [

		{
			name: 'sub_command',
			description: 'sub_command_description',
			type: 1, // SUB_COMMAND
		},

		{
			name: 'group',
			description: 'group_description',
			type: 2, // SUB_COMMAND_GROUP

			options: [

				{
					name: 'subcommand',
					description: 'subcommand_description',
					type: 1, // SUB_COMMAND

					options: [

						{
							name: 'member',
							description: 'option_description',
							type: 6, // MEMBER
							required: true
						}
					]
				}
			]
		}
	],



	async run() {

		console.log( this.member )
	}
},

{
	name: 'command',
	type: 2 // USER
},

{
	name: 'command',
	type: 3 // MESSAGE
}

]
