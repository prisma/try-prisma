const inquirer = require('inquirer');
const TreePrompt = require('../index');

inquirer.registerPrompt('tree', TreePrompt);

inquirer
	.prompt([
		{
			type: 'tree',
			name: 'meal',
			loop: false,
			message: 'Order your meal:',
			tree: [
				{
					name: "burgers",
					value: "",
					children: [
						{
							name: "PLAIN",
							value: "plain burger",
							short: "PLAIN BURGER"
						},
						{
							name: "THE LOT",
							value: "burger with the lot",
							short: "BURGER WITH THE LOT"
						},
					]
				},
				{
					name: "fish",
					value: "",
					children: [
						"whiting",
						"flathead"
					]
				},
				{
					name: "snacks",
					value: "",
					children: [
						"chips",
						"dim sims",
						"calamari",
						"pickled onions",
						"jam donuts",
						{
							name: "fritters",
							value: "",
							children: [
								{
									name: "BANANA",
									value: "banana fritter",
									short: "BANANA FRITTER"
								},
								{
									name: "PINEAPPLE",
									value: "pineapple fritter",
									short: "PINEAPPLE FRITTER"
								}
							]
						}
					]
				}
			],
			transformer: (value) => value.toUpperCase(),
			multiple: true,
			validate: (value) => !!value
		}
	])
	.then(answers => {
		console.log(JSON.stringify(answers))
	});
