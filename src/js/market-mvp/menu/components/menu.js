import AbstractComponent from '../../utils/abstract-component.js'

const menuTemplate = `<ul class="market-header__nav"></ul>`

export default class MenuComponent extends AbstractComponent {
  getTemplate() {
    return menuTemplate
  }
}
