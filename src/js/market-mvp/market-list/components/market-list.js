import AbstractComponent from '../../utils/abstract-component'

const marketListTemplate = `<div class="market-products__list market-content--fade-in"></div>`

export default class MarketListComponent extends AbstractComponent {
  getTemplate() {
    return marketListTemplate
  }
}
