import AbstractComponent from './abstract-component.js'
// Шаблон описания товара и его добавление на страницу
const cartPageTemplate = (productObject, globalSetting) => {
  const dataExist = productObject !== []

  // Если переданный аргумент содержит элементы, то отрисовываем корзину с этими элементами, ...
  if (dataExist) {
    return (
      `<div class="market-cart market-content--fade-in">
      ${productObject
        .map(
          (item) => `      
        <div class="market-cart__product-content">  
          <div class="market-cart__img-wrap">
            <img src="https://media.lpgenerator.ru/images/${
              globalSetting.userId
            }/${item.img}" alt="">
          </div>
          <div class="market-cart__info-wrap">
            <h2 class="market-cart__title">${item.name}</h2>
            ${
              item.option !== undefined
                ? `            
              <div class="market-cart__option-wrap">
                <span class="market-cart__option-title">${item.option.optionName}</span>
                <span class="market-cart__option">${item.option.optionValue}</span>
              </div>`
                : ''
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
                <span class="market-cart__price-quantity">${
                  item.quantity
                }</span>
                <span> x ${item.price + ' ' + globalSetting.currency}</span>
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
        )
        .join('')}` +
      `<div class="market-cart__bottom-content">
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
    `
    )
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
    // Если нужно переопределить конструктор, то вызываем супер
    super()

    this._cart = cart
    this._setting = setting
  }

  getTemplate() {
    return cartPageTemplate(this._cart, this._setting)
  }

  setToMainBtnOnClickHandler(handler) {
    this.getElement()
      .querySelector('.market-cart__link-to-main')
      .addEventListener(`click`, handler)
  }
}
