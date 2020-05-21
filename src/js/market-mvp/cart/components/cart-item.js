import AbstractComponent from '../../utils/abstract-component'

const cartProductTemplate = (globalSetting, item) => {
  return `<div class="market-cart__product-content">  
    <div class="market-cart__img-wrap">
      <img src="https://media.lpgenerator.ru/images/${globalSetting.userId}/${
    item.img
  }" alt="">
    </div>
    <div class="market-cart__info-wrap">
      <h2 class="market-cart__title">${item.name}</h2>
      ${
        item.option
          ? `            
        <div class="market-cart__option-wrap">
          <span class="market-cart__option-title">${item.option.optionName}</span>
          <span class="market-cart__option">${item.option.optionValue}</span>
        </div>`
          : ``
      }
    </div>
    <div class="market-cart__desc-wrap">
      <div class="market-cart__product-price-wrap">
        <span class="market-cart__product-price-title">Стоимость:</span>
        <span class="market-cart__product-total-price-wrap">
          <span class="market-cart__product-total-price">${
            item.price * item.quantity
          }</span>
          <span> ${globalSetting.currency}</span>
        </span>
        <span class="market-cart__total-product-price">
          <span class="market-cart__price-quantity">${item.quantity}</span>
          <span> x ${item.price + ` ` + globalSetting.currency}</span>
        </span>
      </div>
      <div class="market-cart__quantity-wrap">
        <span>Количество:</span>
        <div class="market-cart__quantity-field">
          <a class="market-cart__quantity-down"></a>
          <input type="text" pattern="[0-9]" value="${
            item.quantity
          }" class="market-cart__quantity-input">
          <a class="market-cart__quantity-up"></a>
        </div>
      </div>
      <div class="market-cart__delete-wrap">
        <a class="market-cart__delete"></a>
      </div>
    </div>
  </div>`
}

export default class CartItemComponent extends AbstractComponent {
  constructor(setting, product) {
    super()

    this._setting = setting
    this._product = product
  }

  getTemplate() {
    return cartProductTemplate(this._setting, this._product)
  }

  getQuantityInputElement() {
    return this.getElement().querySelector(`.market-cart__quantity-input`)
  }

  getTotalPriceElement() {
    return this.getElement().querySelector(`.market-cart__product-total-price`)
  }

  getPriceQuantity() {
    return this.getElement().querySelector(`.market-cart__price-quantity`)
  }

  setOpenProductHandler(handler) {
    this.getElement()
      .querySelector(`.market-cart__title`)
      .addEventListener(`click`, handler)

    this.getElement()
      .querySelector(`.market-cart__img-wrap`)
      .addEventListener(`click`, handler)
  }

  setQuantityDownHandler(handler) {
    this.getElement()
      .querySelector(`.market-cart__quantity-down`)
      .addEventListener(`click`, handler)
  }

  setQuantityInputHandler(handler) {
    this.getElement().querySelector(
      `.market-cart__quantity-input`
    ).oninput = handler
  }

  setQuantityUpHandler(handler) {
    this.getElement()
      .querySelector(`.market-cart__quantity-up`)
      .addEventListener(`click`, handler)
  }

  setDeleteProductHandler(handler) {
    this.getElement()
      .querySelector(`.market-cart__delete-wrap`)
      .addEventListener(`click`, handler)
  }
}
