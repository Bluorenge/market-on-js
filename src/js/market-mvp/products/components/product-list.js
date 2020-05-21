import AbstractComponent from '../../utils/abstract-component'

const productListTemplate = `<div class="market-products__list market-content--fade-in"></div>`

export default class ProductListComponent extends AbstractComponent {
  getTemplate() {
    return productListTemplate
  }
}
