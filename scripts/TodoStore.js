class TodoStore {
	constructor() {
		this.items = []
		this.onItemAdd = []
		this.onItemRemove = []
		this.onItemChange = [ () => this.updateStorage() ]

		JSON.parse(localStorage['todos-web-components'] || '[]').forEach(x => this.add(x.summary, x.completed))
	}
	hasActive() {
		return this.items.some(x => !x.completed)
	}
	hasCompleted() {
		return this.items.some(x => x.completed)
	}
	getActive() {
		return this.items.filter(x => !x.completed)
	}
	getCompleted() {
		return this.items.filter(x => x.completed)
	}
	add(summary, completed) {
		let item = new TodoItem(summary, completed)
		item.onChange.push(() => this.onItemChange.forEach(f => f(item)))
		this.items.push(item)
		this.onItemAdd.forEach(f => f(item))
		this.updateStorage()
		return item
	}
	remove(item) {
		this.items.splice(this.items.indexOf(item), 1)
		this.onItemRemove.forEach(f => f(item))
		this.updateStorage()
	}
	removeCompleted() {
		this.items.slice().forEach(item => item.completed && this.remove(item))
		this.updateStorage()
	}
	toggleAll() {
		let val = !this.items.every(x => x.completed)
		this.items.forEach(x => x.completed = val)
	}
	isAllCompleted() {
		return this.items.every(x => x.completed)
	}
	updateStorage() {
		localStorage['todos-web-components'] = JSON.stringify(this.items.map(item => ({summary: item.summary, completed: item.completed})))
	}
}