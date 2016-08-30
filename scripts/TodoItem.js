class TodoItem {
	constructor(summary = '', completed = false) {
		this.onChange = []
		this.summary = summary
		this.completed = completed
	}

	set summary(value) {
		this._summary = value.trim()
		this.onChange.forEach(f => f())
	}
	get summary() {
		return this._summary
	}

	set completed(value) {
		this._completed = value
		this.onChange.forEach(f => f())
	}
	get completed() {
		return this._completed
	}
}