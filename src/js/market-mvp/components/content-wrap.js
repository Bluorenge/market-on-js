import AbstractComponent from './abstract-component.js'

const createMarketContentTemplate = () => {
  return `<section class="market-content"></section>`
}

export default class MarketMainContent extends AbstractComponent {
  getTemplate() {
    return createMarketContentTemplate()
  }
}
