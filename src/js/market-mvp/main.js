import { render, RenderPosition } from './utils/render'

import HeaderComponent from './common-components/header'
import MainContentComponent from './common-components/main-content'

import MenuController from './menu/controllers/menu'
import SearchInputController from './search-input/controllers/search-input'
import ProductPageController from './product-page/controllers/product-page'
import MarketListController from './market-list/controllers/market-list'
import CartController from './cart/controllers/cart'

import { awaitProducts } from './models/products'
import { eventsForStore } from './models/eventsForStore'

// TODO: сделать опцию, чтобы отобразить опции как селект
// TODO: круто было бы на сервере сохранять список всех товаров.
// TODO: количество доступного товара. В том числе и отдельных опций

// TODO: где хранить сохранять значение текущего кол-ва товара?

// Новое:
// 1. Кнопка быстрого добалвения в корзину
// 2. Кнопка быстрой покупки (опционально)
// 3. Открытие страницы товара из корзины
// 4. Кнопка назад на поиске
// 5. Анимация добавления в корзину из списка

// Архитектурные изменения:
// 1. Реализован паттерн MVP.
// 2. Использован стейт-менеджер эфектор.
// 3. Для отрисовки магазина, нужен только один тег на странице.

// DREAMS:
// TODO: возвращаться к результатам поиска. - Пока не получится, потому что сломается поиск, ведь он работает по текущему виду. Плюс инпут очищается при переходе по списку.

// TODO: сделать навигацию по кнопкам назад, когда мышка над магазином. А как историю писать?

class Market {
  constructor(element, setting, products, option) {
    this.container = document.querySelector(`${element}`)
    this._setting = JSON.parse(setting)
    this._products = awaitProducts(JSON.parse(products))
    this._options = Object.assign(
      {
        horizontalScroll: true,
        oneClickOrder: true,
        oneClickOrderCustom: false,
      },
      option,
    )
    awaitProducts.done.watch(() => {
      this._init()
    })
  }

  _init() {
    const header = new HeaderComponent()
    render(this.container, header, RenderPosition.BEFOREEND)

    const inputSearch = new SearchInputController(header)
    inputSearch.render()

    const menuController = new MenuController(header)
    menuController.render()

    const mainContent = new MainContentComponent()
    render(this.container, mainContent, RenderPosition.BEFOREEND)

    const productListController = new MarketListController(
      mainContent,
      this._options,
      this._setting,
    )
    productListController.render()
    // Инициализируем сейчас - отрисовываем потом
    new ProductPageController(mainContent, this._setting)

    // Страница и значок корзины
    const cartController = new CartController(header, mainContent, this._setting)
    cartController.render()
  }

  sendOrder(fn) {
    eventsForStore.sendOrder.watch(fn)
  }

  oneClickOrder(fn) {
    eventsForStore.oneClickOrder.watch(fn)
  }
}

new Market(
  '.market',
  '{"userId": "557933","currency": "₽"}',
  '[{"id":1,"name":"Футболки","img":"1.png","subCategory":[{"id":2,"name":"Крутые","img":"1.png","productsInCategory":[{"id":3,"name":"Крутая первая","price":"1200","img":"1.png","active":true,"desc":"Состав: чистая крутость<br />Ваще круть","options":{"nameOptionList":"Степень крутости","optionList":[{"1":true,"price":"1200"},{"2":true,"price":"300"},{"100500":true,"price":"800"}]}},{"id":4,"name":"Крутая вторая","price":"1300","img":"2.png"}]},{"id":5,"name":"Не оч крутые","img":"2.png","productsInCategory":[{"id":6,"name":"Ну такая первая","price":"800","img":"1.png","active":true,"desc":"Состав: посредственность<br />Пойдёт","options":{"nameOptionList":"Степень обычности","optionList":[{"-1":true,"price":"800"},{"-2":true,"price":"300"},{"-100500":true,"price":"800"}]}}]}]},{"id":7,"name":"Толстковки","img":"1.png","subCategory":[{"id":8,"name":"Крутые2","img":"1.png","subCategory":[{"id":9,"name":"Крутые3","img":"1.png","productsInCategory":[{"id":10,"name":"Крутая первая толст","price":"1200","img":"1.png","desc":"Состав: чистая крутость<br />Ваще круть","active":true,"options":{"nameOptionList":"Степень крутости","optionList":[{"1":true,"price":"1200"},{"2":true,"price":"300"},{"100500":true,"price":"800"}]}},{"id":11,"name":"Крутая вторая толст","price":"1300","img":"2.png","active":true}]}]},{"id":12,"name":"Не оч крутыеТол","img":"2.png","productsInCategory":[{"id":13,"name":"Ну такая первая","price":"800","img":"1.png","desc":"Состав: посредственность<br />Пойдёт","active":true,"options":{"nameOptionList":"Степень обычности","optionList":[{"-1":true,"price":"800"},{"-2":true,"price":"300"},{"-100500":true,"price":"1800"}]}}]}]},{"id":14,"name":"Суперск","price":"6000","img":"1.png","active":true},{"id":15,"name":"Ееее","price":"200","img":"2.png","desc":"Состав: ееее.<br />Ееее ее е ееее.","active":true,"options":{"nameOptionList":"Е","optionList":[{"е":false,"price":"200"},{"ее":true,"price":"300"},{"еее":true,"price":"800"}]}}]',
  { horizontalScroll: true },
).sendOrder(order => {
  console.log('orderList :', order.orderList)
  console.log('totalPrice :', order.totalPrice)
})
