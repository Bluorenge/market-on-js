import { render, remove, RenderPosition } from '../utils/render.js'

import ProductController from '../controller/product'
import ProductPageController from '../controller/product-page'

import ProductListComponent from '../components/product-list'

const renderProducts = (
  productListElement,
  setting,
  products,
  onViewChange
) => {
  const createArrayOfProductControllers = (arr) => {
    return arr.map((item) => {
      const productController = new ProductController(
        productListElement,
        onViewChange
      )
      productController.render(setting, item)
      return productController
    })
  }

  switch (true) {
    case 'subCategory' in products:
      return createArrayOfProductControllers(products.subCategory)
    case 'productsInCategory' in products:
      return createArrayOfProductControllers(products.productsInCategory)
    default:
      return createArrayOfProductControllers(products)
  }
}

const setTypeView = (state) => {
  const typeView = {
    MAIN_PAGE: false,
    CATEGORIES_LIST: false,
    PRODUCT_LIST: false,
    PRODUCT_PAGE: false,
  }

  switch (true) {
    case Array.isArray(state):
      typeView.MAIN_PAGE = true
      return typeView
    case 'subCategory' in state:
      typeView.CATEGORIES_LIST = true
      return typeView
    case 'productsInCategory' in state:
      typeView.PRODUCT_LIST = true
      return typeView
    default:
      typeView.PRODUCT_PAGE = true
      return typeView
  }
}

export default class ProductListController {
  constructor(container, productsModel) {
    this._container = container
    this._productsModel = productsModel
    // Получаем объект с настройками
    this._settings = this._productsModel.getSettings()

    // Обёртка контента
    this._wrap = null

    // Тип отображаемого контетна
    this._typeView = null

    // Корневой элемент контента
    this._containerElement = this._container.getElement()

    // Показанные КОНТРОЛЛЕРЫ (бизнем логика) задач
    this._showedProductControllers = []

    // При клике на пункт
    this._onViewChange = this._onViewChange.bind(this)

    // При клике на пункт меню
    this._onDataChange = this._onDataChange.bind(this)
    this._productsModel.setDataChangeHandler(this._onDataChange)

    // При клике на пункт меню
    this._removeProduct = this._removeProduct.bind(this)
    this._productsModel.setOpenCartHandler(this._removeProduct)
  }

  render() {
    // Получаем массив продуктов
    const products = this._productsModel.getProducts()
    // Создаём массив с КОНТРОЛЛЕРАМИ
    this._renderProduct(this._settings, products)
  }

  _renderProduct(settings, products, id = 0) {
    this._wrap = new ProductListComponent()
    // Создаём обёртку списка
    render(this._containerElement, this._wrap, RenderPosition.BEFOREEND)

    const productListElement = this._wrap.getElement()
    productListElement.id = id

    const newTasks = renderProducts(
      productListElement,
      settings,
      products,
      this._onViewChange
    )

    this._showedProductControllers = this._showedProductControllers.concat(
      newTasks
    )
  }

  _renderProductPage(settings, product) {
    remove(this._wrap)

    const productPageController = new ProductPageController(
      this._containerElement,
      this._productsModel
    )
    productPageController.render(settings, product)
    this._showedProductControllers = this._showedProductControllers.concat(
      productPageController
    )
  }

  _removeProduct() {
    remove(this._wrap)

    // Удаляем все отображаемые задачи
    this._showedProductControllers.forEach((productController) =>
      productController.destroy()
    )
    // Очищаем массив с показанными задачами
    this._showedProductControllers = []
  }

  _onDataChange() {
    // Удаляем отрисованные компоненты компоненты
    this._removeProduct()
    // Создаём новый список продуктов по имени продукта
    const currentState = this._productsModel.getCurrentState()

    // Проверяем у состояния тип контента
    this._typeView = setTypeView(currentState)

    if (
      this._typeView.MAIN_PAGE ||
      this._typeView.CATEGORIES_LIST ||
      this._typeView.PRODUCT_LIST
    ) {
      this._renderProduct(this._settings, currentState, currentState.id)
    } else {
      this._renderProductPage(this._settings, currentState)
    }
  }

  _onViewChange(id, name) {
    this._productsModel.setCurrentState(id, name)
  }
}
