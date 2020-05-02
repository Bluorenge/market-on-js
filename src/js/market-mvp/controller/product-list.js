import { render, remove, RenderPosition } from '../utils/render.js'

import ProductController from '../controller/product'

import ProductListComponent from '../components/product-list'

const renderProducts = (
  productListElement,
  setting,
  products,
  onDataChange,
  onViewChange
) => {
  const addProduct = (product) => {
    const taskController = new ProductController(
      productListElement,
      onDataChange,
      onViewChange
    )
    taskController.render(setting, product)
    return taskController
  }
  if (products.hasOwnProperty('subCategory')) {
    return products.subCategory.map((product) => {
      return addProduct(product)
    })
  } else if (products.hasOwnProperty('productsInCategory')) {
    return products.productsInCategory.map((product) => {
      return addProduct(product)
    })
  } else {
    return products.map((product) => {
      return addProduct(product)
    })
  }
}

export default class ProductListController {
  constructor(container, productsModel) {
    this._container = container
    this._productsModel = productsModel
    // Получаем объект с настройками
    this._settings = this._productsModel.getSettings()

    this._mainContent = new ProductListComponent()

    // Показанные КОНТРОЛЛЕРЫ (бизнем логика) задач
    this._showedProductControllers = []

    // При клике на пункт
    this._onViewChange = this._onViewChange.bind(this)

    // При клике на пункт меню
    this._onDataChange = this._onDataChange.bind(this)

    this._productsModel.setDataChangeHandler(this._onDataChange)
  }

  render() {
    // Дом-элемент обёртки списка
    const container = this._container.getElement()
    // Получаем массив продуктов
    const products = this._productsModel.getProducts()

    // Создаём обёртку списка
    render(container, this._mainContent, RenderPosition.BEFOREEND)

    // Создаём массив с КОНТРОЛЛЕРАМИ
    this._renderProducts(this._settings, products)
  }

  _renderProducts(settings, products, id = 0) {
    const taskListElement = this._mainContent.getElement()
    taskListElement.id = id

    const newTasks = renderProducts(
      taskListElement,
      settings,
      products,
      this._onDataChange,
      this._onViewChange
    )

    this._showedProductControllers = this._showedProductControllers.concat(
      newTasks
    )
  }

  _removeTasks() {
    // Удаляем все отображаемые задачи
    this._showedProductControllers.forEach((productController) =>
      productController.destroy()
    )
    // Очищаем массив с показанными задачами
    this._showedProductControllers = []
  }

  _onDataChange() {
    // Удаляем отрисованные компоненты компоненты
    this._removeTasks()
    // Создаём новый список продуктов по имени продукта
    const openList = this._productsModel.getCurrentState()
    // console.log('openList :', openList);
    // Отрисовываем его
    this._renderProducts(this._settings, openList, 'id')
  }

  _onViewChange(id, name) {    
    // Удаляем отрисованные компоненты компоненты
    // this._removeTasks()
    // Создаём новый список продуктов по имени продукта
    this._productsModel.setCurrentState(id, name)
    
    // const openList = this._productsModel.getCurrentState()
    // Отрисовываем его
    // this._renderProducts(this._settings, openList, id)
  }
}
