import { globalSetting, productList } from './mocks/data'
import { render, RenderPosition } from './utils/render'

import HeaderComponent from './main/header'
import MainContentComponent from './main/content-wrap'

import MenuController from './menu/controller-menu'
import SearchInputController from './search-input/controller-search-input'
import ProductListController from './products/controllers/product-list'
import CartController from './cart/controllers/cart'

import ProductsModel from './products/model-products'
export const setting = JSON.parse('{"userId": "557933","currency": "р."}')

export const option = {
  horizontalScroll: true,
}

// // TODO: при клике на продукт при поиске изменять меню
// // TODO: карусель
// // TODO: скролбар
// // TODO: тень
// // TODO: горизотальный/вертикальный скроллбар
// TODO: кнопка быстрой покупки
// TODO: колбек на покупку

// TODO: сделать опцию, чтобы отобрадать опции как селект
// TODO: количество доступного товара. В том числе и отдельных опций
// TODO: сделать навигацию по кнопкам назад, когда мышка над магазином

// TODO: возвращаться к результатам поиска - пока не получится, потому что сломается поиск, ведь он работает по текущему виду. Плюс инпут очищается при переходе по списку.

class Market {
  constructor(element, setting, products, option) {
    this._container = document.querySelector(`${element}`)
    this._setting = JSON.parse(setting)
    this._products = JSON.parse(products)
    this._option = Object.assign(
      {},
      {
        horizontalScroll: true,
      },
      option
    )
    this._init()
    this._productsStore = createStore(this._products)
  }

  _init() {
    const productsModel = new ProductsModel(this._products)
    console.log('productsModel :', productsModel);
    
    // ---Шапка
    const header = new HeaderComponent()
    render(this._container, header, RenderPosition.BEFOREEND)

    // ---Поиск
    const inputSearch = new SearchInputController(header)
    // Создаём поиск внутри шапки
    inputSearch.render()

    // --Презентер (бизнес-логика) меню
    const menuController = new MenuController(header)
    menuController.render()

    // ---Обёртка контента
    const mainContent = new MainContentComponent()
    // Саздаём обёртку контента
    render(this._container, mainContent, RenderPosition.BEFOREEND)

    // --Презентер списка продуктов
    const productListController = new ProductListController(mainContent)
    productListController.render()
    // --Презентер корзины
    const cartController = new CartController(header, mainContent)
    cartController.render()
  }
}
const market = new Market(
  '.market',
  '{"userId": "557933","currency": "р."}',
  '[{"id":1,"name":"Футболки","img":"1.png","subCategory":[{"id":2,"name":"Крутые","img":"1.png","productsInCategory":[{"id":3,"name":"Крутая первая","price":"1200","img":"1.png","active":true,"desc":"Состав: чистая крутость<br />Ваще круть","options":{"nameOptionList":"Степень крутости","optionList":[{"1":true,"price":"1200"},{"2":true,"price":"300"},{"100500":true,"price":"800"}]}},{"id":4,"name":"Крутая вторая","price":"1300","img":"2.png"}]},{"id":5,"name":"Не оч крутые","img":"2.png","productsInCategory":[{"id":6,"name":"Ну такая первая","price":"800","img":"1.png","active":true,"desc":"Состав: посредственность<br />Пойдёт","options":{"nameOptionList":"Степень обычности","optionList":[{"-1":true,"price":"800"},{"-2":true,"price":"300"},{"-100500":true,"price":"800"}]}}]}]},{"id":7,"name":"Толстковки","img":"1.png","subCategory":[{"id":8,"name":"Крутые2","img":"1.png","subCategory":[{"id":9,"name":"Крутые3","img":"1.png","productsInCategory":[{"id":10,"name":"Крутая первая толст","price":"1200","img":"1.png","desc":"Состав: чистая крутость<br />Ваще круть","active":true,"options":{"nameOptionList":"Степень крутости","optionList":[{"1":true,"price":"1200"},{"2":true,"price":"300"},{"100500":true,"price":"800"}]}},{"id":11,"name":"Крутая вторая толст","price":"1300","img":"2.png","active":true}]}]},{"id":12,"name":"Не оч крутыеТол","img":"2.png","productsInCategory":[{"id":13,"name":"Ну такая первая","price":"800","img":"1.png","desc":"Состав: посредственность<br />Пойдёт","active":true,"options":{"nameOptionList":"Степень обычности","optionList":[{"-1":true,"price":"800"},{"-2":true,"price":"300"},{"-100500":true,"price":"1800"}]}}]}]},{"id":14,"name":"Суперск","price":"6000","img":"1.png","active":true},{"id":15,"name":"Ееее","price":"200","img":"2.png","desc":"Состав: ееее.<br />Ееее ее е ееее.","active":false,"options":{"nameOptionList":"Е","optionList":[{"е":true,"price":"200"},{"ее":false,"price":"300"},{"еее":true,"price":"800"}]}}]',
  { horizontalScroll: true }
)

console.log(market)
// Корневой элемент магазина
// const marketMainElement = document.querySelector('.market')

// // ---Шапка
// const header = new HeaderComponent()
// render(marketMainElement, header, RenderPosition.BEFOREEND)

// // ---Поиск
// const inputSearch = new SearchInputController(header)
// // Создаём поиск внутри шапки
// inputSearch.render()

// // --Презентер (бизнес-логика) меню
// const menuController = new MenuController(header)
// menuController.render()

// // ---Обёртка контента
// const mainContent = new MainContentComponent()
// // Саздаём обёртку контента
// render(marketMainElement, mainContent, RenderPosition.BEFOREEND)

// // --Презентер списка продуктов
// const productListController = new ProductListController(mainContent)
// productListController.render()
// // --Презентер страницы товара
// // const productListController = new ProductListController(mainContent)
// // --Презентер корзины
// const cartController = new CartController(header, mainContent)
// cartController.render()
