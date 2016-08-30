customElements.define('todo-app', class extends HTMLElement {
	constructor() {
		super()

		this.inited = false
		this.attachShadow({mode: 'open'})
		this.shadowRoot.appendChild(document.querySelector('template#todo-app').content.cloneNode(true))

		// add
		this.shadowRoot.querySelector('.new-todo').addEventListener('keydown', e => {
			if (!e.target.value || e.key != 'Enter')
				return
			this.store.add(e.target.value)
			e.target.value = ''
		})

		// toggle all
		this.shadowRoot.querySelector('.toggle-all').addEventListener('change', e => this.store.toggleAll())

		// remove completed
		this.shadowRoot.querySelector('.clear-completed').addEventListener('click', e => this.store.removeCompleted())

		// routing
		onhashchange = () => this.updateState()
	}
	init() {
		if (!this.store || this.inited)
			return
		this.store.items.forEach(item => this.itemAdded(item))
		this.store.onItemAdd.push(item => this.itemAdded(item))
		this.store.onItemRemove.push(item => this.itemRemoved(item))
		this.store.onItemChange.push(item => this.updateState())
		this.updateState()
		this.inited = true
	}
	destroy() {
		this.inited = false
		// also remove event listeners...
	}
	set store(value) {
		if (this._store == value)
			return
		if (!value)
			return this.destroy()
		this._store = value
		this.init()
	}
	get store() {
		return this._store
	}
	connectedCallback() {
		this.init()
	}
	disconnectedCallback() {
		this.destroy()
	}
	itemAdded(item) {
		let el = document.createElement('todo-item')
		el.innerHTML = item.summary
		el.item = item
		el.store = this.store
		this.appendChild(el)
		this.updateState()
	}
	itemRemoved(item) {
		let el = Array.from(this.children).find(el => el.item == item)
		el && el.remove()
		this.updateState()
	}
	updateState() {
		this.setAttribute('show', location.hash.slice(1) || 'all')
		this[(this.store.items.length ? 'remove' : 'set') + 'Attribute']('empty', '')
		this[(this.store.hasCompleted() ? 'remove' : 'set') + 'Attribute']('no-completed-todos', '')
		this.shadowRoot.querySelector('.toggle-all').checked = this.store.isAllCompleted()
		this.shadowRoot.querySelector('.todo-count .number').innerHTML = this.store.getActive().length
		this.shadowRoot.querySelector('.todo-count .what').innerHTML = this.store.getActive().length == 1 ? 'item' : 'items'
	}
})