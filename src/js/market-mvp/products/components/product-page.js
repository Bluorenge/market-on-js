import AbstractComponent from '../../utils/abstract-component'
import { createPrice, firstActiveOptionIndex } from '../../utils/utils'

const createProductPageTemplate = (globalSetting, productObject) => {
  const optionItem = (name, state, arr, index) => {
    return `<li class="market-product__option-item
    ${
      state
        ? firstActiveOptionIndex(arr) === index
          ? ' market-product__option-item--active'
          : ''
        : ' market-product__option-item--disabled'
    }
    ">${name}</li>`
  }
  // Проходимся по массиву опций с установкой активного класса первой активной опции
  const optionsList = (product) => {
    return product.options.optionList
      .map((item, indexItem) => {
        // Превращаем каждый объект опции в массив и выбираем первую строчку
        return Object.entries(item).map(([optionName, optionStatus]) =>
          optionItem(optionName, optionStatus, product, indexItem)
        )[0]
      })
      .join('')
  }

  const optionWrap = (product) => {
    return product.hasOwnProperty('options') && product.options
      ? `<div class="market-product__option-wrap">
           <div class="market-product__option-title">${
             product.options.nameOptionList
           }:</div>
           <ul class="market-product__option-list"> 
             ${optionsList(product)}
           </ul>
         </div>`
      : ''
  }

  const desc = (product) => {
    return product.desc
      ? `<div class="market-product__desc">
          <span class="market-product__desc-title">Описание:</span>
          <p class="market-product__desc-text">${product.desc}</p>
        </div>`
      : ''
  }

  // Внутри превращаем productObject.option в массив и отрисовываем каждый элемент опций
  return `<section class="market-product market-content--fade-in">
    <h2 class="market-product__title">${productObject.name}</h2>
    <div class="market-product__img-wrap">
      <img src="https://media.lpgenerator.ru/images/${globalSetting.userId}/${
    productObject.img
  }" alt="product-img">
    </div>
    <div class="market-product__content-wrap">
      ${optionWrap(productObject)}
      <div class="market-product__price-wrap">
        <span>Стоимость: </span>
        <span class="market-product__price">${createPrice(productObject)}</span>
        <span>${globalSetting.currency}</span>
      </div>
      <button class="market-product__btn market-btn market-btn--add-to-cart">В корзину</button>
    </div>
    ${desc(productObject)}
  </section>`
}

export default class ProductPageComponent extends AbstractComponent {
  constructor(setting, product) {
    super()

    this._setting = setting
    this._product = product
  }

  getTemplate() {
    return createProductPageTemplate(this._setting, this._product)
  }

  getOptionWrap() {
    return this.getElement().querySelector(`.market-product__option-list`)
  }

  getPriceElement() {
    return this.getElement().querySelector('.market-product__price')
  }

  setOrderButtonClickHandler(handler) {
    this.getElement()
      .querySelector(`.market-btn--add-to-cart`)
      .addEventListener(`click`, handler)
  }

  setOptionWrapClickHandler(handler) {
    this.getOptionWrap()
      .querySelectorAll(
        '.market-product__option-item:not(.market-product__option-item--disabled)'
      )
      .forEach((item) => item.addEventListener(`click`, handler))
  }
}
