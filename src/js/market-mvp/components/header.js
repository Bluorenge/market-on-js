import AbstractComponent from './abstract-component.js'

const createHeaderTemplate = () => {
  return `<header class="market-header"></header>`
}

export default class Header extends AbstractComponent {
  getTemplate() {
    return createHeaderTemplate()
  }
}
