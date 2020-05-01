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

    this._onDataChange = this._onDataChange.bind(this)
    this._onViewChange = this._onViewChange.bind(this)

    this._tasksModel.setDataChangeHandler()
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

  _onDataChange(productController) {}

  _onViewChange(id, name) {
    this._productsModel.setMenuItem({id, name})

    this._removeTasks()
    // Создаём новый список продуктов по имени продукта
    const openList = this._productsModel.getOpenProduct(id, name)
    // Отрисовываем его
    this._renderProducts(this._settings, openList, id)
  }
}
