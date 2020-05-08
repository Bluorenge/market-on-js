import AbstractComponent from './abstract-component.js'

const createInputSearchTemplate = () => {
  return `<div class="market-header__search-panel">
    <input type="text" class="market-header__search-input" placeholder="Поиск">
  </div>`
}

export default class SearchInputComponent extends AbstractComponent {
  getTemplate() {
    return createInputSearchTemplate()
  }

  getInput() {
    return this.getElement().querySelector('.market-header__search-input')
  }

  setInputHandler(handler) {
    this.getInput().oninput = handler
  }
}
