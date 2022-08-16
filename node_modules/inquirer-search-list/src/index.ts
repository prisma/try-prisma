import Base = require("inquirer/lib/prompts/base");
import observe = require("inquirer/lib/utils/events");
import figures = require("figures");
import Paginator = require("inquirer/lib/utils/paginator");
import chalk from "chalk";
import * as fuzzy from "fuzzy";

interface Event {
	key: {
		name: string;
		ctrl: boolean;
		meta: boolean;
	};
	value: string;
}

interface Item extends Base.Item {
	id: number;
}

const ignoreKeys = ["up", "down", "space"];

function renderChoices(choices: Item[], pointer: number) {
	var output = "";

	choices.forEach(function(choice, i) {
			var isSelected = i === pointer;
			output += isSelected ? chalk.cyan(figures.pointer) : " ";
			output += ` ${isSelected ? chalk.cyan(choice.name) : choice.name}`;

		output += "\n";
	});

	return output.replace(/\n$/, "");
}

class SearchBox extends Base {
	private pointer: number = 0;
	private selected: string | undefined = '';
	// @ts-ignore
        private done: (state: any) => void;
	private list: Item[] = [];
	private filterList: Item[] = [];
	private paginator: Paginator = new Paginator();

	constructor(...params: any[]) {
		super(...params);
		const { choices } = this.opt;

		if (!choices) {
			this.throwParamError("choices");
		}

		this.filterList = this.list = choices
			.filter(() => true) // fix slice is not a function
			.map((item, id) => ({ ...item, id }));
	}

	render(error?: string) {
		// Render question
		var message = this.getQuestion();
		var bottomContent = "";
		const tip = chalk.dim("(Press <enter> to submit)");

		// Render choices or answer depending on the state
		if (this.status === "answered") {
			message += chalk.cyan(this.selected ? this.selected : '');
		} else {
			message += `${tip} ${this.rl.line}`;
			const choicesStr = renderChoices(this.filterList, this.pointer);
			bottomContent = this.paginator.paginate(
				choicesStr,
				this.pointer,
				this.opt.pageSize
			);
		}

		if (error) {
			bottomContent = chalk.red(">> ") + error;
		}

		this.screen.render(message, bottomContent);
	}

	filterChoices() {
		const options = {
			extract: (el: Item) => el.name
		};

		this.filterList = fuzzy.filter(this.rl.line, this.list, options).map(el => el.original);
	}

	onDownKey() {
		const len = this.filterList.length;
		this.pointer = this.pointer < len - 1 ? this.pointer + 1 : 0;
		this.render();
	}

	onUpKey() {
		const len = this.filterList.length;
		this.pointer = this.pointer > 0 ? this.pointer - 1 : len - 1;
		this.render();
	}

	onAllKey() {
            this.render();
	}

	onEnd(state: any) {
		this.status = "answered";
                if(this.getCurrentValue()) {
                    this.selected = this.getCurrentValue()
                }
		// Rerender prompt (and clean subline error)
		this.render();

		this.screen.done();
		this.done(state.value);
	}

	onError(state: any) {
		this.render(state.isValid);
	}

	onKeyPress() {
		this.pointer = 0;
		this.filterChoices();
		this.render();
	}

	getCurrentValue() {
            if(this.filterList.length) {
                return this.filterList[this.pointer].value
            } else {
		return this.list[this.pointer].value
            }
	}

	_run(cb: any) {
		this.done = cb;

		const events = observe(this.rl);
		const upKey = events.keypress.filter(
			(e: Event) =>
				e.key.name === "up" || (e.key.name === "p" && e.key.ctrl)
		);
		const downKey = events.keypress.filter(
			(e: Event) =>
				e.key.name === "down" || (e.key.name === "n" && e.key.ctrl)
		);
		const allKey = events.keypress.filter(
			(e: Event) => e.key.name === "o" && e.key.ctrl
		);
		const validation = this.handleSubmitEvents(
			events.line.map(this.getCurrentValue.bind(this))
		);

		validation.success.forEach(this.onEnd.bind(this));
		validation.error.forEach(this.onError.bind(this));
		upKey.forEach(this.onUpKey.bind(this));
		downKey.forEach(this.onDownKey.bind(this));
		allKey.takeUntil(validation.success).forEach(this.onAllKey.bind(this));
		events.keypress
			.filter(
				(e: Event) => !e.key.ctrl && !ignoreKeys.includes(e.key.name)
			)
			.takeUntil(validation.success)
			.forEach(this.onKeyPress.bind(this));

		this.render();
		return this;
	}
}

export = SearchBox;
