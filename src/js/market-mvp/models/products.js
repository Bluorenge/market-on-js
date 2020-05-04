import { inputFindProduct, menuPath, findByName } from '../utils/filter'
import { addProductToCart } from '../utils/utils'

const entryMenu = [{ id: 0, name: 'Главная' }]

export default class Products {
  constructor(setting, products) {
    this._globalSetting = JSON.parse(setting)
    this._productList = JSON.parse(products)

    this._menu = [...entryMenu]

    // Текущее состояние листа
    this._currentState = []
    // Результат поиска
    this._searchResult = []
    // Корзина
    this._cart = []

    this._dataChangeHandlers = []
    this._dataChangeCartHandlers = []
    this._openCartHandler = []
  }

  // setProducts(setting, products) {
  //   this._productList = JSON.parse(setting)
  //   this._globalSetting = JSON.parse(products)
  // }

  getSettings() {
    return this._globalSetting
  }

  getProducts() {
    return this._productList
  }

  getMenu() {
    return this._menu
  }

  getCurrentState() {
    return this._currentState
  }

  getSearchResult() {
    return this._searchResult
  }

  getCart() {
    return this._cart
  }

  setCurrentState(id, name, fromMenu = false) {
    // Обновляем текущее состояние
    this._currentState = findByName(this._productList, id, name)
    // Если это не главная
    if (this._currentState !== undefined) {
      // Проверяем как строить меню. Если вызов из компонента меню
      if (fromMenu) {
        this._menu = [...entryMenu].concat(
          menuPath(this._productList, id, name)
        )
      } else {
        this._menu.push({ id, name })
      }
    } else {
      // Обнуляем меню
      this._menu = [...entryMenu]
      // Обновляем состояние списка на главную страницу
      this._currentState = this._productList
    }
    // Вызываем слушатель
    this._callHandlers(this._dataChangeHandlers)
  }

  setProductToCart(product, productPrice, optionName, optionValue) {
    this._cart = addProductToCart(this._cart, product, productPrice, optionName, optionValue)
    this._callHandlers(this._dataChangeCartHandlers)
  }

  // setSearchProducts(name) {
  //   this._searchResult = inputFindProduct(this._productList)
  //   this._callHandlers(this._dataChangeIntoInputHandlers)
  // }

  setOpenCart() {
    this._callHandlers(this._openCartHandler)
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler)
  }

  setDataCartChangeHandler(handler) {
    this._dataChangeCartHandlers.push(handler)
  }

  setOpenCartHandler(handler) {
    this._openCartHandler.push(handler)
  }

  // Колбек слушателей - подписка на обновление модели
  _callHandlers(handlers) {
    handlers.forEach((handler) => handler())
  }
}
