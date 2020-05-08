import AbstractComponent from './abstract-component.js'

const createCartIconTemplate = (data, setting) => {
  const dataExist = data.length > 0
  const iconClass = dataExist ? ` market-cart-link__icon-wrap--filled` : ''
  const text = dataExist
    ? `<div class="market-cart-link__text-row">
        <span class="market-cart-link__price">${
          data
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toLocaleString('ru-RU') +
          ' ' +
          setting.currency
        }</span>
      </div>`
    : '<div class="market-cart-link__empty">Корзина пуста</div>'

  return `<div class="market-header__cart market-cart-link">
    <div class="market-cart-link__icon-wrap${iconClass}">
      <div class="cart-line-1"></div>
      <div class="cart-line-2"></div>
      <div class="cart-line-3"></div>
      <div class="cart-wheel"></div>
    </div>
    <div class="market-cart-link__text">${text}</div>
  </div>`
}

export default class CartIconComponent extends AbstractComponent {
  constructor(cart, setting) {
    // Если нужно переопределить конструктор, то вызываем супер
    super()
    
    this._cart = cart
    this._setting = setting
  }

  getTemplate() {
    return createCartIconTemplate(this._cart, this._setting)
  }

  setProductCount() {
    const quantityAll = this._cart.reduce(
      (total, item) => total + item.quantity,
      0
    )

    this.getElement()
      .querySelector('.market-cart-link__icon-wrap')
      .setAttribute('data-before', quantityAll)
  }

  setOpenCartClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler)
  }
}
