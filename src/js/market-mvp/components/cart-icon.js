import AbstractComponent from './abstract-component.js'

const createCartIconTemplate = () => {
  return `<div class="market-header__cart market-cart-link">
    <div class="market-cart-link__icon-wrap">
      <div class="cart-line-1"></div>
      <div class="cart-line-2"></div>
      <div class="cart-line-3"></div>
      <div class="cart-wheel"></div>
    </div>
    <div class="market-cart-link__text">
    </div>
  </div>`
}

export default class CartIconComponent extends AbstractComponent {
  getTemplate() {
    return createCartIconTemplate()
  }
}
