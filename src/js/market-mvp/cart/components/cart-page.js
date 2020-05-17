import AbstractComponent from '../../utils/abstract-component.js'

const createCartPageTemplate = (productObject, globalSetting) => {
  const dataExist = productObject.length > 0

  // Если переданный аргумент содержит элементы, то отрисовываем корзину с этими элементами, ...
  if (dataExist) {
    return `<div class="market-cart market-content--fade-in">
        <div class="market-cart__bottom-content">
          <div class="market-cart__total-price-wrap">
            <span>Общая стоимость: </span>
            <span class="market-cart__total-price">${productObject
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toLocaleString('ru-RU')}</span>
            <span> ${globalSetting.currency}</span>
          </div>
          <a class="market-cart__link-to-main">Выбрать ещё товары</a>
          <button class="market-btn market-cart__btn market-cart__btn--order">Оформить заказ</button>
        </div>
      </div>
    </div>`
  }
  // ...иначе отрисовываем пустую корзины
  else {
    return `<div class="market-cart market-cart--empty market-content--fade-in">
      <div>Ваша корзина пуста</div>
      <a class="market-cart__link-to-main market-btn">Вернуться на главную</a>
    </div>`
  }
}

export default class CartPageComponent extends AbstractComponent {
  constructor(cart, setting) {
    super()

    this._cart = cart
    this._setting = setting
  }

  getTemplate() {
    return createCartPageTemplate(this._cart, this._setting)
  }

  getTotalPriceElement() {
    return this.getElement().querySelector('.market-cart__total-price')
  }

  setToMainBtnOnClickHandler(handler) {
    this.getElement()
      .querySelector('.market-cart__link-to-main')
      .addEventListener(`click`, handler)
  }

  setMakeOrderBtnOnClickHandler(handler) {
    this.getElement()
      .querySelector('.market-cart__btn--order')
      .addEventListener(`click`, handler)
  }
}
