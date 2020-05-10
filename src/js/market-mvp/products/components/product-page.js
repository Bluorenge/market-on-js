import AbstractComponent from '../../utils/abstract-component'

const createProductPageTemplate = (globalSetting, productObject) => {
  // Проходимся по массиву опций с установкой активного класса первой активной опции
  const optionsList = () => {
    return productObject.options.optionList
      .map(
        (item, indexItem) =>
          // Превращаем каждый объект опции в массив и выбираем первую строчку
          Object.entries(item).map(
            ([key, value]) =>
              `<li class="market-product__option-item
              ${
                // Если опция активна
                value === true
                  ? // Ищем её индекс, и если он равен индексу родительского элемента
                    productObject.options.optionList.findIndex((option) =>
                      Object.keys(option).map(([key]) => key === true)
                    ) === indexItem
                    ? // Задаём активный класс
                      'market-product__option-item--active'
                    : ''
                  : // Иначе отключаем опцию
                    'market-product__option-item--disabled'
              }
          ">${key}</li>`
          )[0]
      )
      .join('')
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
      ${
        productObject.hasOwnProperty('options') && productObject.options
          ? `<div class="market-product__option-wrap">
              <div class="market-product__option-title">${
                productObject.options.nameOptionList
              }:</div>
              <ul class="market-product__option-list"> 
                ${optionsList()}
              </ul>
            </div>`
          : ''
      }
      <div class="market-product__price-wrap">
        <span>Стоимость: </span>
        <span class="market-product__price">${productObject.price.toLocaleString(
          'ru-RU'
        )}</span>
        <span>${globalSetting.currency}</span>
      </div>
      <button class="market-product__btn market-btn market-btn--add-to-cart">В корзину</button>
    </div>
    ${
      productObject.desc
        ? `<div class="market-product__desc">
            <span class="market-product__desc-title">Описание:</span>
            <p class="market-product__desc-text">${productObject.desc}</p>
          </div>`
        : ''
    }
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
