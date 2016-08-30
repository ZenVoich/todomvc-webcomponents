customElements.define('todo-item', class extends HTMLElement {
	constructor() {
		super()

		this.attachShadow({mode: 'open'})
		this.shadowRoot.appendChild(document.querySelector('template#todo-item').content.cloneNode(true))

		this.shadowRoot.querySelector('.toggle').addEventListener('change', e => this.item.completed = e.target.checked)
		this.shadowRoot.querySelector('.destroy').addEventListener('click', e => this.destroy())
		this.shadowRoot.querySelector('label').addEventListener('dblclick', e => this.edit())
		this.shadowRoot.querySelector('input.edit').addEventListener('keydown', e => {
			if (e.key == 'Enter')
				this.save()
			if (e.key == 'Escape')
				this.save(false)
		})
		this.shadowRoot.querySelector('input.edit').addEventListener('blur', e => this.save())
	}
	connectedCallback() {
		this.item.onChange.push(() => this.itemChanged())
		this.itemChanged()
	}
	itemChanged() {
		this.innerHTML = this.item.summary
		this.shadowRoot.querySelector('.toggle').checked = this.item.completed
		this.shadowRoot.querySelector('li').classList[this.item.completed ? 'add' : 'remove']('completed')
		this[(this.item.completed ? 'set' : 'remove') + 'Attribute']('completed', '')
	}
	edit() {
		if (this.editing)
			return
		this.editing = true
		this.shadowRoot.querySelector('li').classList.add('editing')
		let input = this.shadowRoot.querySelector('input.edit')
		input.value = this.item.summary
		input.focus()
	}
	save(save = true) {
		if (!this.editing)
			return
		this.editing = false
		let input = this.shadowRoot.querySelector('input.edit')
		if (save)
			this.item.summary = input.value
		this.shadowRoot.querySelector('li').classList.remove('editing')
		save && !input.value.trim() && this.destroy()
		input.value = ''
	}
	destroy() {
		this.store.remove(this.item)
	}
})