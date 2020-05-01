import { inputFindProduct, findByName } from '../utils/filter'

export default class Products {
  constructor(setting, products) {
    this._globalSetting = JSON.parse(setting)
    this._productList = JSON.parse(products)

    this._searchHandler = []
    this._currentStat

    this._dataChangeHandlers = []

    this._menu = [{ id: 0, name: 'Главная' }]
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

  getOpenProduct(id, name) {
    this._currentStat = findByName(this._productList, id, name)
    return this._currentStat
  }

  getSearchProducts(name) {
    this._searchHandler = inputFindProduct(this._productList)
    return this._searchHandler
  }

  setMenuItem(name) {
    this._menu.push(name)
    this._dataChangeHandlers.push(handler)
    this._callHandlers(this._dataChangeHandlers)
  }

  // Колбек слушателей - подписка на обновление модели
  _callHandlers(handlers) {
    handlers.forEach((handler) => handler())
  }
}
