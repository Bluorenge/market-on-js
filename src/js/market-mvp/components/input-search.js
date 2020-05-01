import AbstractComponent from './abstract-component.js'

const createInputSearchTemplate = () => {
  return `<div class="market-header__search-panel">
    <input type="text" class="market-header__search-input" placeholder="Поиск">
  </div>`
}

export default class InputSearch extends AbstractComponent {
  getTemplate() {
    return createInputSearchTemplate()
  }
}