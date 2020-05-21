import AbstractComponent from '../../utils/abstract-component'
import { createPrice, isItProductInCart } from '../../utils/utils'
import { $cart } from '../../cart/model-cart'

const createProductTemplate = (globalSetting, option, listItem) => {
  const isProduct = `price` in listItem
  const productExist = !isItProductInCart($cart.getState(), listItem.name)
    ? `+`
    : `✓`

  const oneClickBtn =
    isProduct && option.oneClickOrder && !listItem.hasOwnProperty(`options`)
      ? `<button class="market-products__product-btn market-btn market-products__product-btn--one-click-order">в 1 клик</button>`
      : ``

  const bottomContentTemplate = () => {
    return `<div class="market-products__product-bottom">
    <span class="market-products__product-price">${createPrice(listItem)} ${
      globalSetting.currency
    }</span>
    <div class="market-products__product-btn-wrap">
      ${oneClickBtn}
      <button class="market-products__product-btn market-btn market-products__product-btn--add-to-cart">
        <span>${productExist}</span>
        <span class="gg-shopping-cart"></span>
      </button>
    </div>
  </div>`
  }

  const isActive =
    isProduct && !listItem.active ? ` style="display: none;"` : ``

  const checkNeedBottomContent = isProduct ? bottomContentTemplate() : ``

  return `<div id="product-${listItem.id}" class="market-products__product"${isActive}>
    <div class="market-products__product-wrap">
      <h2 class="market-products__product-title">${listItem.name}</h2>
      <div class="market-products__product-img-wrap"><img src="https://media.lpgenerator.ru/images/${globalSetting.userId}/${listItem.img}"></div>
      ${checkNeedBottomContent}
    </div>
  </div>`
}

export default class ProductlistItemComponent extends AbstractComponent {
  constructor(setting, option, product) {
    super()

    this._setting = setting
    this._option = option
    this._product = product
  }

  getTemplate() {
    return createProductTemplate(this._setting, this._option, this._product)
  }

  getProductNameElement() {
    return this.getElement().querySelector(`.market-products__product-title`)
  }

  getProductPriceElement() {
    return this.getElement().querySelector(`.market-products__product-price`)
  }

  setOpenButtonClickHandler(handler) {
    this.getElement()
      .querySelector(`.market-products__product-img-wrap`)
      .addEventListener(`click`, handler)
    this.getElement()
      .querySelector(`.market-products__product-title`)
      .addEventListener(`click`, handler)
  }

  setAddToCartBtnClickHandler(handler) {
    this.getElement()
      .querySelector(`.market-products__product-btn--add-to-cart`)
      .addEventListener(`click`, handler)
  }

  setOneClickOrderBtnClickHandler(handler) {
    this.getElement()
      .querySelector(`.market-products__product-btn--one-click-order`)
      .addEventListener(`click`, handler)
  }
}
