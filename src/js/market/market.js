// // TODO: повесить обработчик на весь контент магазина
// // TODO: отображать 'ничего не найдено' при нулевом поиске
// // TODO: Уменьшить задержку при поиске
// // TODO: изменять цену при выборе опции
// // TODO: теперь можно дублировать названия
// // TODO: кнопка назад из товара
// // TODO: сделать вертикальную прокрутку в корзине
// // TODO: сделать опцию, чтобы сделать вертикальную прокрутку

// TODO: сделать опцию, чтобы отобрадать опции как селект
// TODO: добавить бы ссылку на товар из корзины
// TODO: а если отсутствует картинка товара?
// TODO: добавить кнопку в корзину на карточке
// TODO: сделать поиск по уровню
// TODO: сделать проверку наличия товара в категории

// TODO: удалять слайдер и кастомный бар после работы?

// Импортируем шаблоны
import {
  createNavItem,
  createProductList,
  createProductPage,
  createCartPage,
  createCartBlock,
} from './tamplates'

// Имортируем служебные функции
import {
  findByName,
  inputFindProduct,
  menuPath,
  debounce,
  elementReady,
  carousel,
  carouselNav,
  addScrollBar
} from './utils'
/* 
  Логика работы приложения:
  0. Отрисовываем первый уровень каталога
  1. При клике по элементу, заполняем [currentItem]
    Каким образом? Находим элемент в главном массиве [productData] по заголовку.
    Записываем этот элемент в [currentItem]
  2. Проверям [currentItem] на наличие в нём подкатегорий, товаров, либо товара.
    В зависимости от результата проверок, отрисовываем нужную инфу, используя шаблон
*/
;(function (factory) {
  typeof define === `function` && define.amd
    ? define(factory)
    : typeof exports === `object`
    ? (module.exports = factory())
    : factory()
})(function () {
  ;(`use strict`) // eslint-disable-line no-unused-expressions

  /* globals window:true */
  let _window = typeof window !== `undefined` ? window : this
  const market = (_window.market = function (
    globalSettingJson,
    productListJson,
    userCallbacks,
    settings
  ) {
    // Глобальные настройки магазина (id пользователя, валюта магазина)
    const globalSetting = JSON.parse(globalSettingJson)
    // Товары магазина
    const productList = JSON.parse(productListJson)

    let callbacks = {
      order: function () {},
    }
    console.log(`callbacks :`, callbacks);

    let parameters = {
      horizontalScroll: true,
      optionStyle: `button`,
    }

    parameters = Object.assign(parameters, settings)

    callbacks = Object.assign(callbacks, userCallbacks)

    // [] с текущим состоянии приложения (листом товаров, категории)
    let currentState
    // [] с товарами в корзине
    let cart = []

    // Корзина (миниатюра)
    const cartWrap = document.querySelector(`.market-cart-link`)
    // Поле поиска
    const searchInput = document.querySelector(`.market-header__search-input`)
    // Обёртка меню
    const marketMenuWrap = document.querySelector(`.market-header__nav`)
    // Иконка корзины
    const iconCart = document.querySelector(`.market-cart-link__icon-wrap`)
    // Обёртка контента страницы
    const marketContentWrap = document.querySelector(`.market-content`)

    // * Блок с функциями программы

    // Удаление тени у блока с контентом
    const deleteShadow = () => {
      // Если обёртка контента имеент тень...
      if (marketContentWrap.classList.contains(`market-content--shadow`)) {
        // ...удаляем её
        marketContentWrap.classList.remove(`market-content--shadow`)
      }
    }

    // Получаем общую ширину всех элементов навигации
    const checkForNeedCarouselToNav = () => {
      // Находим все карточки в каталоге
      // ! привязка к классу
      const navItems = document.querySelectorAll(`.market-header__nav-item`)

      elementReady(`.market-header__nav-item`).then(() => {
        // Задаём начальную ширину
        let width = 0
        // Проходим по каждой карточке в каталоге и складываем их ширину
        for (let item of navItems) {
          // + 20 потому что маргин
          width += item.offsetWidth + 20
        }
        carouselNav(width)
      })
    }

    // Добавление пункта в меню
    const addMunuItem = (currentState, id) => {
      // Находим имя категории/товара
      const nameMenuItem = currentState.name
      // ...добавляем его в меню, и...
      createNavItem(nameMenuItem, id)
      checkForNeedCarouselToNav()
    }

    // Проверка клика по карточке каталога (для лучшего UX)
    const checkClickOnCartProduct = (element) => {
      // ! привязка к имени тега. что если ещё будет ещё одно изображение в блоке
      const checkElement = [
        element.classList.contains(`market-products__product-title`),
        element.classList.contains(`market-products__product-img-wrap`),
        element.tagName === `IMG`,
        element.classList.contains(`market-btn`),
      ]

      // Проверка, содержит ли переданный элемент класс из массива
      return checkElement.some((item) => item === true)
    }

    // Удаляем все пункты меню, кроме первого
    const deleteNavItemToFirst = () => {
      // Находим все пункты меню
      let navItems = document.querySelectorAll(`.market-header__nav-item`)

      // Проходим по коллекции пунктов меню
      navItems.forEach((item, index) => {
        // Если индекс элемента не первый, т.е. "Главная" то...
        if (index !== 0) {
          // ...удаляем его
          item.remove()
        }
      })
    }

    // Вернуться на предудщую страницу
    const oneStepBack = () => {
      const menuItems = marketMenuWrap.querySelectorAll(
        `.market-header__nav-item`
      )

      const prevMenuItem = menuItems[menuItems.length - 2]
      const lastMenuItem = menuItems[menuItems.length - 1]

      // Находим в [productList] подкатегорию/товар, соответствующие подзаголовку
      const findElementInArr = findByName(
        productList,
        Number(prevMenuItem.id.replace(/[^+\d]/g, ``)),
        prevMenuItem.textContent
      )
      lastMenuItem.remove()

      if (findElementInArr !== undefined) {
        // Проверяем, что именно отрисовывать
        createCurrentState(findElementInArr, findElementInArr.id, false)
      } else {
        createCurrentState(findElementInArr)
      }
    }

    // Создаём путь до элемента (нужно после использования поиска)
    const createMenuPath = (id, name) => {
      const marketMenu = menuPath(productList, id, name)
      createNavItem(undefined, undefined, marketMenu)
      checkForNeedCarouselToNav()
    }

    // Возвращаем состояние после использования поиска
    const stateAfterSearch = (id, name) => {
      // Если в поле поиска есть текст...
      if (searchInput.value.length > 0) {
        // ...удаляем его
        searchInput.value = ``
      }

      // Удаляем последний пункт меню
      const lastMenuItem = marketMenuWrap.querySelector(
        `.market-header__nav li:last-child`
      )

      if (lastMenuItem.textContent === `Поиск`) {
        deleteNavItemToFirst()
        createMenuPath(id, name)
      }
    }

    // Создать текущее состояние приложения
    const createCurrentStateData = () => {
      // Всплываем до карточки каталога
      const productItem = event.target.closest(`.market-products__product`)

      // Получаем текст подзаголовка текущей карточки
      const nameOfItem = productItem.querySelector(
        `.market-products__product-title`
      ).textContent

      const productId = Number(productItem.id.replace(/[^+\d]/g, ``))

      stateAfterSearch(productId, nameOfItem)

      // Находим в [productList] подкатегорию/товар, соответствующие подзаголовку
      currentState = findByName(productList, productId, nameOfItem)
      createCurrentState(currentState, currentState.id)
    }

    // Обработчик клика на список товаров (категорию/товар) листа, в котором...
    const onProductHendler = () => {
      const productListWrap = marketContentWrap.querySelector(
        `.market-products__list`
      )
      const previousBtn = marketContentWrap.querySelector(
        `.market-btn--prev-step`
      )

      // Если это страница с карточками
      if (productListWrap !== null) {
        // Прверяем клик по элементам карточки
        if (checkClickOnCartProduct(event.target)) {
          createCurrentStateData()
        } else if (event.target === previousBtn) {
          oneStepBack()
        }
      }
    }

    // Проверяем, нужна ли карусель
    const checkForNeedCarousel = () => {
      // Находим все товары
      const productsItem = document.querySelectorAll(
        `.market-products__product`
      )

      // Проверяем загрузились ли дом-элементы карточек списка
      elementReady(`.market-products__product`).then(() => {
        // Задаём начальное значение
        let productListWidth = 0
        // Проходим по коллекции, в которой...
        for (let item of productsItem) {
          // ...прибавляем ширину карточки к начальному значению
          productListWidth += item.offsetWidth
        }
        carousel(productListWidth, parameters.horizontalScroll)
      })
    }

    // * Страница товара

    // Изменение классов опций товара
    const changeClassOfActiveOption = () => {
      // Обёртка кнопок опций
      const optionList = marketContentWrap.querySelector(
        `.market-product__option-list`
      )

      // Если это активная кнопка
      if (
        event.target.tagName === `LI` &&
        event.target.classList.contains(
          `market-product__option-item--disabled`
        ) === false
      ) {
        // Находим все кнопки опций
        const optionBtn = optionList.querySelectorAll(
          `.market-product__option-item--active`
        )
        // Удаляем активный класс у всех опций
        optionBtn.forEach((item) =>
          item.classList.remove(`market-product__option-item--active`)
        )
        // Добавляем активный класс на нажатую кнопку
        event.target.classList.toggle(`market-product__option-item--active`)
      }
    }

    // Создание [] с товарами и их отрисовка в миниатюре
    const addProductToCart = (
      product,
      productPrice,
      optionName,
      optionValue
    ) => {
      // Объект c инфой о выбранном товаре
      const newProductCart = {
        name: product.name,
        img: product.img,
        price: productPrice,
        option:
          optionName !== undefined
            ? {
                optionName: optionName,
                optionValue: optionValue,
              }
            : undefined,
        quantity: 1,
      }

      // Проверяем существует ли товар {newProductCart} в корзине [cart]
      const existingProduct = cart.find((item) =>
        item.option !== undefined
          ? item.name === newProductCart.name &&
            item.option.optionValue === optionValue
          : item.name === newProductCart.name
      )

      // Если товар {newProductCart} существует, то увеличиваем количество quantity этого объекта
      if (existingProduct) {
        existingProduct.quantity++
      }
      // Иначе присоединяем этот объект к [cart]
      else {
        cart = cart.concat(newProductCart)
      }

      quantityInCartBlock()
    }

    const animatedAddToCart = () => {
      // Находим изображение товара
      const productPic = document.querySelector(`.market-product__img-wrap img`)

      // Клонируем его
      const cloneProductPic = productPic.cloneNode(true)

      // Добавляем ему класс анимации
      cloneProductPic.classList.add(`market-product__animate`)

      // Вставляем копию картинки после картинки
      productPic.after(cloneProductPic)
    }

    // Добавление товара в корзину
    const onProductPageHandler = (product) => {
      const productWrap = marketContentWrap.querySelector(`.market-product`)

      if (productWrap !== null) {
        // Обёртка опций
        const optionWrap = productWrap.querySelector(
          `.market-product__option-wrap`
        )
        let productPrice = productWrap.querySelector(`.market-product__price`)

        // Если нажата кнопка добавления в корзину
        if (event.target.classList.contains(`market-btn--add-to-cart`)) {
          // Записываем имя и значение опции
          if (optionWrap !== null) {
            // Название группы опций
            const optionName = optionWrap.querySelector(
              `.market-product__option-title`
            ).textContent
            // Название выбранной опции
            const optionValue = optionWrap.querySelector(
              `.market-product__option-item--active`
            ).textContent

            // Добавляем товар с опцией в виде {} в корзину
            addProductToCart(
              product,
              productPrice.textContent,
              optionName,
              optionValue
            )
          } else {
            addProductToCart(product, productPrice.textContent)
          }
          animatedAddToCart()
        }

        // Если нажата активная опция
        if (
          event.target.classList.contains(`market-product__option-item`) &&
          !event.target.classList.contains(
            `market-product__option-item--disabled`
          )
        ) {
          changeClassOfActiveOption()
          // Находим имя опции
          const optionName = event.target.textContent
          // Находим в массиве опций объект по этому имени
          const optionPrice = product.options.optionList.find(
            (option) => option[optionName]
          )
          // Меняем цену товара
          productPrice.textContent = optionPrice.price
        }

        // Если нажата кнопка шага назад
        if (event.target.classList.contains(`market-btn--prev-step`)) {
          oneStepBack()
        }
      }
    }

    // Создание кнопки назад
    const createPrevBtn = () => {
      marketContentWrap.insertAdjacentHTML(
        `beforeend`,
        `<button class="market-btn--prev-step">← Назад</button>`
      )
    }

    /**
     * Отрисовывка необходимой информации по шаблонам
     * * самая главная функция
     * @param {array} data - текущее состояние приложения
     */
    const createCurrentState = (data, id, createMenuItem = true) => {
      // Очищаем обёртку контента
      marketContentWrap.innerHTML = ``
      // Удаляем тень
      deleteShadow()
      // Если текущее состояние приложения существует, то...
      if (data !== undefined) {
        if (createMenuItem) {
          // Добавляем соответствующий пункт меню
          addMunuItem(data, id)
        }
        // Если найденный элемент содержит подкатегории...
        if (data.hasOwnProperty(`subCategory`)) {
          // Отрисовываем по шаблону список товаров с данными подкатегории
          createProductList(data.subCategory, globalSetting, id)
          createPrevBtn()
          // Проверяем нужна ли карусель
          checkForNeedCarousel()
        }
        // Иначе, если найденный элемент содержит только товары категории
        else if (data.hasOwnProperty(`productsInCategory`)) {
          // Отрисовываем по шаблону список товаров категории/подкатегории
          createProductList(data.productsInCategory, globalSetting, id)
          createPrevBtn()
          // Проверяем нужна ли карусель
          checkForNeedCarousel()
        }
        // Иначе, если это товар
        else {
          // Отрисовываем по шаблону страницу с товаром
          createProductPage(data, globalSetting, id)
          createPrevBtn()
        }
      }
      // Иначе создаём главную страницу
      else {
        // Отрисовываем по шаблону список товаров первого уровня
        createProductList(productList, globalSetting)
        // Проверяем нужна ли карусель
        checkForNeedCarousel()
        // Обнуляем текущее состояние
        data = undefined
      }
    }

    // * Код для корзины

    // Отрисовка количества товаров в блоке корзины
    const quantityInCartBlock = () => {
      // Общее количество товаров в [cart] с начальным значением 0
      const quantityAll = cart.reduce((total, item) => total + item.quantity, 0)

      // Отрисовка количества в индикаторе корзины (красный кружок)
      iconCart.setAttribute(`data-before`, quantityAll)
      // Отрисовываем новую инфу по шаблоне в блоке корзины
      createCartBlock(cart, globalSetting)
    }

    /**
     * Отрисовка изменения цены и количества
     *
     * @param {object} productData - объект товара в [cart]
     * @param {HTMLElement} element - обёртка текущего товара
     */
    const changePrice = (productData, element) => {
      // Накходим обёртку общей цены товара
      const productTotalPrice = element.querySelector(
        `.market-cart__product-total-price`
      )
      // Изменяем общую цену внутри карточки товара
      productTotalPrice.textContent = (
        productData.price * productData.quantity
      ).toLocaleString(`ru-RU`)

      // Находим обёртку количества товара
      const priceQuantity = element.querySelector(
        `.market-cart__price-quantity`
      )
      // Изменяем количество товара
      priceQuantity.textContent = productData.quantity

      // Накходим обёртку общей цены всех товаров
      const priceTotal = document.querySelector(`.market-cart__total-price`)
      // Изменяем общую цену всех товаров
      priceTotal.textContent = cart
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toLocaleString(`ru-RU`)
    }

    /**
     * Изменение количества товара в массиве и их отрисовка
     *
     * @param {object} productData - объект товара в [cart]
     * @param {HTMLElement} element - обёртка текущего товара
     */
    const changeQuantityProduct = (productData, element) => {
      // Находим кнопку увеличения количества товара
      const quantityUp = element.querySelector(`.market-cart__quantity-up`)
      // Находим кнопку уменьшения количества товара
      const quantityDown = element.querySelector(`.market-cart__quantity-down`)
      // Находим инпут с количеством товара
      const quantityInput = element.querySelector(
        `.market-cart__quantity-input`
      )

      // Проверяем, есть ли у товара опции
      const checkProduct = (product) => {
        if (product.option !== undefined) {
          // Передаём product.option, чтобы избежать un-ed в массиве
          addProductToCart(
            product,
            product.price,
            product.option.optionName,
            product.option.optionValue
          )
        } else {
          addProductToCart(product, product.price)
        }
      }

      // Если нажата кнопка увеличения количества товаров
      if (event.target === quantityUp) {
        // Увеличиваем value у инпута
        quantityInput.value++
        // Проверяем, есть ли у товара опции
        checkProduct(productData)
        // Отрисовываем изменения цены и количества
        changePrice(productData, element)
      }

      // Если нажата кнопка уменьшения количества товаров
      if (event.target === quantityDown && quantityInput.value > 1) {
        // Уменьшаем value у инпута
        quantityInput.value--
        // ! -1 потому что внутри функции добавления в корзину будет увеличение на 1
        productData.quantity = quantityInput.value - 1
        // Проверяем, есть ли у товара опции
        checkProduct(productData)
        // Отрисовываем изменения цены и количества
        changePrice(productData, element)
      }

      // Отлавливаем ручное изменение инпута
      quantityInput.oninput = debounce(() => {
        // Если первый символ ноль
        if (quantityInput.value[0] === `0`) {
          quantityInput.value = 1
        }
        // Если ввод пустой
        if (quantityInput.value === ``) {
          quantityInput.value = 1
        }
        // Зачем-то ещё одна проверка (пока делал, забыл зачем. какой-то баг был)
        if (quantityInput.value < `0` || quantityInput.value > `9`) {
          quantityInput.value = 1
        }

        // Запрещаем ввод букв
        quantityInput.value = quantityInput.value.replace(/\D/g, ``)

        productData.quantity = quantityInput.value - 1
        checkProduct(productData)
        changePrice(productData, element)
      }, 200)
    }

    /**
     * Удаление продукта из корзины
     *
     * @param {object} productIndex - объект товара в [cart]
     * @param {HTMLElement} element - обёртка текущего товара
     */
    const deleteProductFromCart = (productIndex, element) => {
      // Кнопка удаления товара
      const deleteProductBtn = element.querySelector(
        `.market-cart__delete-wrap`
      )

      // Если нажата кнопка удаления товара
      if (event.target === deleteProductBtn) {
        cart.splice(productIndex, 1)

        // Отрисовываем страницу корзины с новыми данными
        createCartPage(cart, globalSetting)
        // Отрисовываем цену
        quantityInCartBlock()
      }
    }

    const changeProductDataInCart = () => {
      const currentCartElement = event.target.closest(
        `.market-cart__product-content`
      )

      // Если обёртка товара найдена
      if (currentCartElement !== null) {
        // Настройки для поиска
        const checkProduct = (item) => {
          // Находим заголовок текущего товара
          const productTitle = currentCartElement.querySelector(
            `.market-cart__title`
          ).textContent
          // Находим опцию текущего товара
          const productOption = currentCartElement.querySelector(
            `.market-cart__option`
          )
          // Если опции есть
          return productOption !== null
            ? // элемент должен совпадать по имени и названию опции
              item.name === productTitle &&
                item.option.optionValue === productOption.textContent
            : // иначе только по имени
              item.name === productTitle
        }

        // Находим сам элемент в массиве корзины
        const currentCartItem = cart.find((product) => checkProduct(product))

        // Находим индекс элемента
        const currentCartItemIndex = cart.findIndex((product) =>
          checkProduct(product)
        )

        changeQuantityProduct(currentCartItem, currentCartElement)
        deleteProductFromCart(currentCartItemIndex, currentCartElement)
      }
    }

    // Отправка заказа
    const sendOrder = (parentElement) => {
      const btnOrder = parentElement.querySelector(`.market-cart__btn--order`)

      if (event.target === btnOrder) {
        const productTextarea = parentElement.querySelector(
          `.market-cart__textarea`
        )

        if (productTextarea !== null) {
          productTextarea.remove()
        }

        const productItem = parentElement.querySelectorAll(
          `.market-cart__product-content`
        )
        const orderArray = []

        for (let product of productItem) {
          const title = product.querySelector(`.market-cart__title`)
          const optionName = product.querySelector(`.market-cart__option-title`)
          const optionValue = product.querySelector(`.market-cart__option`)
          const quantityOfProduct = product.querySelector(
            `.market-cart__price-quantity`
          )
          const priceOfProduct = product.querySelector(
            `.market-cart__product-total-price`
          )

          orderArray.push({
            name: title.textContent,
            optionName:
              // ноль потому что дом-элементы
              optionName !== null ? optionName.textContent : undefined,
            optionValue:
              optionValue !== null ? optionValue.textContent : undefined,
            quantity: quantityOfProduct.textContent,
            price: priceOfProduct.textContent,
          })
        }

        const totalPrice = parentElement.querySelector(
          `.market-cart__total-price`
        )

        // Формируем массив с товарами
        const orderList = (arr) => {
          let order = []
          arr.map((item, index) => {
            const product = {
              id: ++index,
              name: item.name,
              count: Number(item.quantity),
              price: Number(item.price.replace(/\s/g, ``)),
            }
            if (item.optionName !== undefined) {
              product.optionName = item.optionName.replace(/\:/, ``)
              product.optionValue = item.optionValue
            }
            return order.push(product)
          })
          return order
        }

        callbacks.order(
          orderList(orderArray),
          Number(totalPrice.textContent.replace(/\s/g, ``))
        )
      }
    }

    // Возвращение на главную страницу
    const onBackToMainPageBtn = (parentElement) => {
      // Кнопка возврата на главную
      const toMainFromCartBtn = parentElement.querySelector(
        `.market-cart__link-to-main`
      )

      // Если нажата кнопка
      if (event.target === toMainFromCartBtn) {
        deleteNavItemToFirst()
        // Обнуляем текущее состояние
        currentState = undefined
        // Отрисовываем текущее состояние
        createCurrentState(currentState)
      }
    }

    // Обработчик на странице корзины
    const onCartPageHandler = () => {
      const contentCartWrap = document.querySelector(`.market-cart`)

      // Если контент корзины найден
      if (contentCartWrap !== null) {
        changeProductDataInCart()
        sendOrder(contentCartWrap)
        onBackToMainPageBtn(contentCartWrap)
      }
    }

    // * Код программы

    // Шаг №0
    // Создаём текст в миниатюре корзины...
    createCartBlock(cart, globalSetting)
    // ...и список категорий
    createCurrentState(currentState)

    // Чтобы после поиска построить правильное меню
    let lastNavItemName
    // Обработчик на поле поиска
    searchInput.oninput = debounce(() => {
      // Ищем все элементы по введённому в поле значению
      const searchElements = inputFindProduct(productList, searchInput.value)
      const lastNavItem = marketMenuWrap.querySelector(
        `.market-header__nav li:last-child`
      )

      if (lastNavItem.textContent !== `Поиск`) {
        lastNavItemName = lastNavItem.textContent
        deleteNavItemToFirst()
        createNavItem(`Поиск`, `search`)
      }

      const lastNavItemId = Number(marketContentWrap.id.replace(/[^+\d]/g, ``))

      // Если элементы не найдены
      if (searchElements.length === 0) {
        // Выводим сообщение об отсутствии результатов
        marketContentWrap.innerHTML = `<div class="market-content--fade-in market-content__empty">Ничего не найдено</div>`
      } else {
        // Если в поле введено больше одного символа
        if (searchInput.value.length > 0) {
          marketContentWrap.innerHTML = ``
          createProductList(searchElements, globalSetting)
          checkForNeedCarousel()
        }
        // Иначе, если символов в поле нет (пользователь удалил все символы)
        else {
          stateAfterSearch(lastNavItemId, lastNavItemName)
          createCurrentState(currentState)
        }
      }
    }, 150)

    // Обработчик клика события на всё меню
    marketMenuWrap.addEventListener(`click`, () => {
      // Если клик произошёл на теге li
      if (event.target.tagName === `LI`) {
        // Находим все пункты меню
        let navItems = document.querySelectorAll(`.market-header__nav-item`)

        // Получаем текст пункта меню
        const textMenuItem = event.target.textContent

        // Находим индекс элемента
        const indexNavItem = [...navItems].findIndex(
          (item) => item.textContent === textMenuItem
        )

        /*
          Если это первый элемент (Главная)
          и это не единственный пункт меню в [marketMenu]
          (чтобы лишний раз не отрисовывать контент,
          когда находишься на главной)
        */
        if (indexNavItem === 0 && navItems.length > 1) {
          // Удаляем все пункты меню, кроме "Главной"
          deleteNavItemToFirst()
          // Очищаем текущее состояние листа
          currentState = undefined

          // Отрисовываем текущее состояние
          createCurrentState(currentState)
        }
        // Иначе, если клик произошёл не на последнем элементе
        else if (indexNavItem !== navItems.length - 1) {
          // Удаляем все элементы до пункта, по которому был сделан клик
          navItems.forEach((item, index) => {
            if (index > indexNavItem - 1) {
              item.remove()
            }
          })
          const menuId = Number(event.target.id.replace(/[^+\d]/g, ``))
          // Ищем соответсвующий заголовку элемент в [productList]
          currentState = findByName(productList, menuId, textMenuItem)

          // Отрисовываем текущее состояние
          createCurrentState(currentState, menuId)
        }
      }
    })

    // Обработчик клика на корзину (миниатюра блока наверху)
    cartWrap.addEventListener(`click`, () => {
      // Обёртка контента в корзине
      const cartContent = document.querySelector(`.market-cart`)

      // Если контент корзины не отрисован, то...
      if (cartContent === null) {
        // Удаляем все пункты меню, кроме первого
        deleteNavItemToFirst()
        // Добавляем в меню пункт с корзиной
        createNavItem(`Корзина`, `cart`)

        // Очищаем обёртку
        marketContentWrap.innerHTML = ``
        deleteShadow()

        // Создаём страницу корзины на основе [cart]
        createCartPage(cart, globalSetting)
        const cartContent = document.querySelector(`.market-cart`)
        addScrollBar(cartContent)
      }
    })

    // Обработчик клика на контент магазина
    marketContentWrap.addEventListener(`click`, () => {
      onProductHendler()
      onProductPageHandler(currentState)
      onCartPageHandler()
    })
  })

  return market
})

market(
  `{"userId": "557933","currency": "р."}`,
  `[{"id":1,"name":"Футболки","img":"1.png","subCategory":[{"id":2,"name":"Крутые","img":"1.png","productsInCategory":[{"id":3,"name":"Крутая первая","price":"1200","img":"1.png","active":true,"desc":"Состав: чистая крутость<br />Ваще круть","options":{"nameOptionList":"Степень крутости","optionList":[{"1":true,"price":"1200"},{"2":true,"price":"300"},{"100500":true,"price":"800"}]}},{"id":4,"name":"Крутая вторая","price":"1300","img":"2.png"}]},{"id":5,"name":"Не оч крутые","img":"2.png","productsInCategory":[{"id":6,"name":"Ну такая первая","price":"800","img":"1.png","active":true,"desc":"Состав: посредственность<br />Пойдёт","options":{"nameOptionList":"Степень обычности","optionList":[{"-1":true,"price":"800"},{"-2":true,"price":"300"},{"-100500":true,"price":"800"}]}}]}]},{"id":7,"name":"Толстковки","img":"1.png","subCategory":[{"id":8,"name":"Крутые2","img":"1.png","subCategory":[{"id":9,"name":"Крутые3","img":"1.png","productsInCategory":[{"id":10,"name":"Крутая первая толст","price":"1200","img":"1.png","desc":"Состав: чистая крутость<br />Ваще круть","active":true,"options":{"nameOptionList":"Степень крутости","optionList":[{"1":true,"price":"1200"},{"2":true,"price":"300"},{"100500":true,"price":"800"}]}},{"id":11,"name":"Крутая вторая толст","price":"1300","img":"2.png","active":true}]}]},{"id":12,"name":"Не оч крутыеТол","img":"2.png","productsInCategory":[{"id":13,"name":"Ну такая первая","price":"800","img":"1.png","desc":"Состав: посредственность<br />Пойдёт","active":true,"options":{"nameOptionList":"Степень обычности","optionList":[{"-1":true,"price":"800"},{"-2":true,"price":"300"},{"-100500":true,"price":"1800"}]}}]}]},{"id":14,"name":"Суперск","price":"6000","img":"1.png","active":true},{"id":15,"name":"Ееее","price":"200","img":"2.png","desc":"Состав: ееее.<br />Ееее ее е ееее.","active":false,"options":{"nameOptionList":"Е","optionList":[{"е":true,"price":"200"},{"ее":false,"price":"300"},{"еее":true,"price":"800"}]}}]`,
  {
    order: (orderList, orderTotalPrice) => {
      console.log(`orderList :`, orderList)
      console.log(`orderTotalPrice :`, orderTotalPrice)
    },
  },
  { horizontalScroll: true }
)
