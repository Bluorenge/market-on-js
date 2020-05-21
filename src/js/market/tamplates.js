// Обёртка меню
const marketMenuWrap = document.querySelector(`.market-header__nav`)
// Обёртка контента страницы
const marketContentWrap = document.querySelector(`.market-content`)

// Шаблон меню и его добавление на страницу
const createNavItem = (title, id, path) => {
  let menu
  if (path !== undefined) {
    menu = path
      .map(
        (item) =>
          `<li id="menu-${item.id}" class="market-header__nav-item market-header__nav-item--sub">${item.name}</li>`
      )
      .join(``)
  } else {
    menu = `<li id="menu-${id}" class="market-header__nav-item market-header__nav-item--sub">${title}</li>`
  }

  const slider = marketMenuWrap.querySelector(`div`)

  // Если обёртка слайдера найдена, то вставляем меню туда
  if (slider !== null) {
    slider.insertAdjacentHTML(`beforeend`, menu)
  } else {
    marketMenuWrap.insertAdjacentHTML(`beforeend`, menu)
  }
}

// Шаблон списка с категориями/товарами и его добавление на страницу
const createProductList = (productListArray, globalSetting, contentId) => {
  const productItemHtml = (item) => `
  <div id="product-${item.id}" class="market-products__product">
    <div class="market-products__product-wrap">
      <h2 class="market-products__product-title">${item.name}</h2>
      <div class="market-products__product-img-wrap"><img src="https://media.lpgenerator.ru/images/${
        globalSetting.userId
      }/${item.img}"></div>
      <div class="market-products__product-bottom">
        ${
          item.price !== undefined
            ? `<span class="market-products__product-price">${item.price.toLocaleString(
                `ru-RU`
              )} ${globalSetting.currency}</span>`
            : ``
        }
        <button class="market-products__product-btn market-btn">Подробнее</button>
      </div>
    </div>
  </div>`

  // Создаём тег li категории/товара с информацией из [] с информацией о категориях и о товарах
  const newProductList = productListArray
    .map((productItem) => {
      if (productItem.active) {
        return productItemHtml(productItem)
      } else if (
        `subCategory` in productItem ||
        `productsInCategory` in productItem
      ) {
        return productItemHtml(productItem)
      }
    })
    .join(``)

  // Создаём тег ul и вставляем туда получившиеся пункты
  const productListWrap = document.createElement(`div`)
  // Задаём ему класс
  productListWrap.className = `market-products__list market-content--fade-in`
  // Добавляем список
  productListWrap.innerHTML = newProductList
  // Добавляем кнопки для карусели
  marketContentWrap.insertAdjacentHTML(
    `afterbegin`,
    `<div role="tablist" class="dots"></div>`
  )
  if (contentId !== undefined) {
    marketContentWrap.id = contentId
  }

  // Вставляем получившийся список категорий/товаров в html-разметку
  marketContentWrap.append(productListWrap)
}

// Шаблон описания товара и его добавление на страницу
// - какой же там громоздкий код внутри, для проверки активного класс
const createProductPage = (productObject, globalSetting, contentId) => {
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
                      `market-product__option-item--active`
                    : ``
                  : // Иначе отключаем опцию
                    `market-product__option-item--disabled`
              }
          ">${key}</li>`
          )[0]
      )
      .join(``)
  }

  // Внутри превращаем productObject.option в массив и отрисовываем каждый элемент опций
  const productPage = `<section class="market-product market-content--fade-in">
      <h2 class="market-product__title">${productObject.name}</h2>
      <div class="market-product__img-wrap">
        <img src="https://media.lpgenerator.ru/images/${globalSetting.userId}/${
    productObject.img
  }" alt="product-img">
      </div>
      <div class="market-product__content-wrap">
        ${
          `options` in productObject && productObject.options !== undefined
            ? `<div class="market-product__option-wrap">
                <div class="market-product__option-title">${
                  productObject.options.nameOptionList
                }:</div>
                <ul class="market-product__option-list"> 
                  ${optionsList()}
                </ul>
              </div>`
            : ``
        }
        <div class="market-product__price-wrap">
          <span>Стоимость: </span>
          <span class="market-product__price">${productObject.price.toLocaleString(
            `ru-RU`
          )}</span>
          <span>${globalSetting.currency}</span>
        </div>
        <button class="market-product__btn market-btn market-btn--add-to-cart">В корзину</button>
      </div>
      ${
        productObject.desc !== undefined
          ? `<div class="market-product__desc">
              <span class="market-product__desc-title">Описание:</span>
              <p class="market-product__desc-text">${productObject.desc}</p>
            </div>`
          : ``
      }
    </section>`

  if (contentId !== undefined) {
    marketContentWrap.id = contentId
  }
  marketContentWrap.innerHTML = productPage
}

// Шаблон описания товара и его добавление на страницу
const createCartPage = (productObject, globalSetting) => {
  let productPage

  // Если переданный аргумент содержит элементы, то отрисовываем корзину с этими элементами, ...
  if (productObject.length > 0) {
    productPage =
      `
      <div class="market-cart market-content--fade-in">
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
                <span class="market-cart__price-quantity">${
                  item.quantity
                }</span>
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
        </div>
      `
        )
        .join(``)}` +
      `<div class="market-cart__bottom-content">
          <div class="market-cart__total-price-wrap">
            <span>Общая стоимость: </span>
            <span class="market-cart__total-price">${productObject
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toLocaleString(`ru-RU`)}</span>
            <span> ${globalSetting.currency}</span>
          </div>
          <a class="market-cart__link-to-main">Выбрать ещё товары</a>
          <button class="market-btn market-cart__btn market-cart__btn--order">Оформить заказ</button>
        </div>
      </div>
    `
  }
  // ...иначе отрисовываем пустую корзины
  else {
    productPage = `
    <div class="market-cart market-cart--empty market-content--fade-in">
      <div>Ваша корзина пуста</div>
      <a class="market-cart__link-to-main market-btn">Вернуться на главную</a>
    </div>
    `
  }

  marketContentWrap.innerHTML = productPage
}

/* 
Шаблон строки с инфой о товарах в блоке корзины (внутри сложные проверки окончаний - спасибо русскому языку за это)
*/
const createCartBlock = (productObject, globalSetting) => {
  let cartBlock
  // Иконка корзины
  const iconCart = document.querySelector(`.market-cart-link__icon-wrap`)

  if (productObject.length > 0) {
    iconCart.classList.add(`market-cart-link__icon-wrap--filled`)
    cartBlock = `
      <div class="market-cart-link__text-row">
        <span class="market-cart-link__price">${
          productObject
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toLocaleString(`ru-RU`) +
          ` ` +
          globalSetting.currency
        }</span>
      </div>
    `
  } else {
    if (iconCart.classList.contains(`market-cart-link__icon-wrap--filled`)) {
      iconCart.classList.remove(`market-cart-link__icon-wrap--filled`)
    }
    cartBlock = `
      <div class="market-cart-link__empty">Корзина пуста</div>
    `
  }

  // Обёртка текста корзины
  const cartBlockText = document.querySelector(`.market-cart-link__text`)

  cartBlockText.innerHTML = cartBlock
}

export {
  createNavItem,
  createProductList,
  createProductPage,
  createCartPage,
  createCartBlock,
}
