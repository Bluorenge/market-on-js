import AbstractComponent from './abstract-component.js'

const createMenuTemplate = () => {
  return `<ul class="market-header__nav"></ul>`
}

export default class MenuComponent extends AbstractComponent {
  getTemplate() {
    return createMenuTemplate()
  }
}
