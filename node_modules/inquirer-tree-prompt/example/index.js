const inquirer = require('inquirer');
const TreePrompt = require('../index');

inquirer.registerPrompt('tree', TreePrompt);

inquirer
	.prompt([
		{
			type: 'tree',
			name: 'location',
			message: 'Where is my phone?',
			tree: [
				{
					value: "in the house",
					open: true,
					children: [
						{
							value: "in the living room",
							children: [
								"on the sofa",
								"on the TV cabinet"
							]
						},
						{
							value: "in the bedroom",
							children: [
								"under the bedclothes",
								"on the bedside table"
							]
						},
						"in the bathroom"
					]
				},
				{
					value: "in the car",
					children: [
						"on the dash",
						"in the compartment",
						"on the seat"
					]
				}
			]
		}
	])
	.then(answers => {
		console.log(JSON.stringify(answers))
	});
