import AbstractComponent from '../utils/abstract-component'

const createMarketContentTemplate = `<section class="market-content"></section>`

export default class MarketMainContent extends AbstractComponent {
  getTemplate() {
    return createMarketContentTemplate
  }
}
