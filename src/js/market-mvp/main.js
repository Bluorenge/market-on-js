import { render, RenderPosition } from './utils/render'

import HeaderComponent from './main/header'
import MainContentComponent from './main/content-wrap'

import MenuController from './menu/controller-menu'
import SearchInputController from './search-input/controller-search-input'
import ProductListController from './products/controllers/product-list'
import CartController from './cart/controllers/cart'

import { awaitProducts, $productList } from './products/model-products'
import MenuModel from './menu/model-menu'

// // TODO: при клике на продукт при поиске изменять меню
// // TODO: карусель
// // TODO: скролбар
// // TODO: тень
// // TODO: горизотальный/вертикальный скроллбар
// TODO: кнопка быстрой покупки
// // TODO: колбек на покупку
// FIXME: запретить поиск в корзине
// FIXME: удалять "ничего не найдено" при переходе в корзину

// TODO: сделать опцию, чтобы отобрадать опции как селект
// TODO: количество доступного товара. В том числе и отдельных опций
// TODO: сделать навигацию по кнопкам назад, когда мышка над магазином

// TODO: возвращаться к результатам поиска - пока не получится, потому что сломается поиск, ведь он работает по текущему виду. Плюс инпут очищается при переходе по списку.

class Market {
  constructor(element, setting, products, option) {
    this.container = document.querySelector(`${element}`)
    this._setting = JSON.parse(setting)
    this._products = awaitProducts(JSON.parse(products))
    this._options = Object.assign(
      {},
      {
        horizontalScroll: true,
      },
      option
    )
    this._sendOrder = this._sendOrder.bind(this)
    this.order = () => {}
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

    const productListController = new ProductListController(
      mainContent,
      this._options,
      this._setting
    )
    productListController.render()

    // const cartController = new CartController(
    //   header,
    //   mainContent,
    //   this._setting,
    //   productsModel,
    //   this._sendOrder
    // )
    // cartController.render()
  }

  _sendOrder(orderList, orderTotalPrice) {
    this.order(orderList, orderTotalPrice)
  }

  sendOrder(fn) {
    this.order = fn
  }
}

new Market(
  '.market',
  '{"userId": "557933","currency": "р."}',
  '[{"id":1,"name":"Футболки","img":"1.png","subCategory":[{"id":2,"name":"Крутые","img":"1.png","productsInCategory":[{"id":3,"name":"Крутая первая","price":"1200","img":"1.png","active":true,"desc":"Состав: чистая крутость<br />Ваще круть","options":{"nameOptionList":"Степень крутости","optionList":[{"1":true,"price":"1200"},{"2":true,"price":"300"},{"100500":true,"price":"800"}]}},{"id":4,"name":"Крутая вторая","price":"1300","img":"2.png"}]},{"id":5,"name":"Не оч крутые","img":"2.png","productsInCategory":[{"id":6,"name":"Ну такая первая","price":"800","img":"1.png","active":true,"desc":"Состав: посредственность<br />Пойдёт","options":{"nameOptionList":"Степень обычности","optionList":[{"-1":true,"price":"800"},{"-2":true,"price":"300"},{"-100500":true,"price":"800"}]}}]}]},{"id":7,"name":"Толстковки","img":"1.png","subCategory":[{"id":8,"name":"Крутые2","img":"1.png","subCategory":[{"id":9,"name":"Крутые3","img":"1.png","productsInCategory":[{"id":10,"name":"Крутая первая толст","price":"1200","img":"1.png","desc":"Состав: чистая крутость<br />Ваще круть","active":true,"options":{"nameOptionList":"Степень крутости","optionList":[{"1":true,"price":"1200"},{"2":true,"price":"300"},{"100500":true,"price":"800"}]}},{"id":11,"name":"Крутая вторая толст","price":"1300","img":"2.png","active":true}]}]},{"id":12,"name":"Не оч крутыеТол","img":"2.png","productsInCategory":[{"id":13,"name":"Ну такая первая","price":"800","img":"1.png","desc":"Состав: посредственность<br />Пойдёт","active":true,"options":{"nameOptionList":"Степень обычности","optionList":[{"-1":true,"price":"800"},{"-2":true,"price":"300"},{"-100500":true,"price":"1800"}]}}]}]},{"id":14,"name":"Суперск","price":"6000","img":"1.png","active":true},{"id":15,"name":"Ееее","price":"200","img":"2.png","desc":"Состав: ееее.<br />Ееее ее е ееее.","active":true,"options":{"nameOptionList":"Е","optionList":[{"е":false,"price":"200"},{"ее":true,"price":"300"},{"еее":true,"price":"800"}]}}]',
  { horizontalScroll: true }
).sendOrder((orderList, orderTotalPrice) => {
  console.log('orderList :', orderList)
  console.log('orderTotalPrice :', orderTotalPrice)
})
