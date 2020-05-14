import AbstractComponent from '../../utils/abstract-component'
import { createPrice } from '../../utils/utils'

const createProductTemplate = (globalSetting, item) => {
  // Проверяем, существует ли цена
  const priceExist = 'price' in item
  // Шаблон цены
  const priceTemplate = () => {
    return `<span class='market-products__product-price'>${createPrice(item)} ${
      globalSetting.currency
    }</span>`
  }

  const isActive = priceExist && !item.active ? ' style="display: none;"' : ''

  // Присваиваем цену переменной
  const getPrice = priceExist ? priceTemplate() : ''

  return `<div id="product-${item.id}" class='market-products__product'${isActive}>
    <div class="market-products__product-wrap">
      <h2 class='market-products__product-title'>${item.name}</h2>
      <div class='market-products__product-img-wrap'><img src='https://media.lpgenerator.ru/images/${globalSetting.userId}/${item.img}'></div>
      <div class='market-products__product-bottom'>
        ${getPrice}
        <button class='market-products__product-btn market-btn market-products__product-btn--open'>Подробнее</button>
      </div>
    </div>
  </div>`
}

export default class ProductItemComponent extends AbstractComponent {
  constructor(setting, product) {
    super()

    this._setting = setting
    this._product = product
  }

  getTemplate() {
    return createProductTemplate(this._setting, this._product)
  }

  getProductNameElement() {
    return this.getElement().querySelector('.market-products__product-title')
  }

  setOpenButtonClickHandler(handler) {
    this.getElement()
      .querySelector(`.market-products__product-img-wrap`)
      .addEventListener(`click`, handler)
    this.getElement()
      .querySelector(`.market-products__product-title`)
      .addEventListener(`click`, handler)
    this.getElement()
      .querySelector(`.market-products__product-btn--open`)
      .addEventListener(`click`, handler)
  }
}
