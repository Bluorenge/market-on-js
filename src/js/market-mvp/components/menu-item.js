import AbstractComponent from './abstract-component.js'

const createMenuItemTemplate = (item) => {
  return `<li id="menu-${item.id}" class="market-header__nav-item">${item.name}</li>`
}
// const createMenuItemTemplate = (items) => {
//   return items.map((item) => `<li class="market-header__nav-item">${item}</li>`).join('')
// }

export default class MenuComponent extends AbstractComponent {
  constructor(items) {
    // Если нужно переопределить конструктор, то вызываем супер
    super()

    this._items = items
  }

  getTemplate() {
    return createMenuItemTemplate(this._items)
  }

  setOpenButtonClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler)
  }
}
