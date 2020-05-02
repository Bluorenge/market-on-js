import { inputFindProduct, menuPath, findByName } from '../utils/filter'

const entryMenu = [{ id: 0, name: 'Главная' }]

export default class Products {
  constructor(setting, products) {
    this._globalSetting = JSON.parse(setting)
    this._productList = JSON.parse(products)

    this._currentState = []
    this._searchResult = []

    this._dataChangeHandlers = []
    this._dataChangeIntoMenuHandlers = []

    this._menu = [...entryMenu]
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

  setCurrentState(id, name) {
    // Добавляем пункт меню
    this._menu.push({ id, name })
    // Обновляем текущее состояние
    this._currentState = findByName(this._productList, id, name)
    // Вызываем слушатель
    this._callHandlers(this._dataChangeHandlers)
  }

  setCurrentStateIntoMenu(id, name) {
    this._currentState = findByName(this._productList, id, name)

    if (this._currentState !== undefined) {
      this._menu = [...entryMenu].concat(menuPath(this._productList, id, name))
    } else {
      this._menu = [...entryMenu]
      this._currentState = this._productList
    }

    this._callHandlers(this._dataChangeHandlers)
  }

  // setSearchProducts(name) {
  //   this._searchResult = inputFindProduct(this._productList)
  //   this._callHandlers(this._dataChangeIntoInputHandlers)
  // }

  setMenuItem(name) {
    this._menu.push(name)
    this._callHandlers(this._dataChangeHandlers)
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler)
  }

  setDataIntoMenuHandler(handler) {
    this._dataChangeIntoMenuHandlers.push(handler)
  }

  // Колбек слушателей - подписка на обновление модели
  _callHandlers(handlers) {
    console.log('handlers :', handlers)
    handlers.forEach((handler) => handler())
  }
}
