import AbstractComponent from '../../utils/abstarct-component'

const menuAddCategoryTemplate = (id, category = true) => {
  const type = category ? `Новая категория` : `Новый товар`

  return `<li id=menu-item-${id} class="data-maker__menu-item">
    <button class="data-maker__item-btn">${type}</button>
  </li>`
}

export default class MenuItemComponent extends AbstractComponent {
  constructor(id, type) {
    super()

    this.id = id
    this.type = type
  }

  getTemplate() {
    return menuAddCategoryTemplate(this.id, this.type)
  }

  getIndex() {
    return this.id
  }

  getNameMenuItem() {
    return this.getElement().querySelector(`.data-maker__item-btn`).textContent
  }

  setNameMenuItem(name) {
    this.getElement().querySelector(`.data-maker__item-btn`).textContent = name
  }

  setOpenItemHandler(handler) {
    this.getElement().querySelector(`.data-maker__item-btn`).addEventListener(`click`, handler)
  }

  setDisabledBtn() {
    this.getElement().querySelector(`.data-maker__item-btn`).disabled = true
  }

  setEnabledBtn() {
    this.getElement().querySelector(`.data-maker__item-btn`).disabled = false
  }
}
