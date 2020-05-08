import {
  createElement,
  render,
  remove,
  RenderPosition,
} from '../utils/render.js'

import ProductController from '../controller/product'
import ProductPageController from '../controller/product-page'

import ProductListComponent from '../components/product-list'

import {
  setting,
  $search,
  $productList,
  openCartPage,
  closeCartPage,
  changeProductListStateFromInput,
  // search
} from '../models/products'

const renderProducts = (productListElement, setting, products) => {
  const createArrayOfProductControllers = (arr) => {
    return arr.map((item) => {
      const productController = new ProductController(productListElement)
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

const getContentViewType = (state) => {
  const typeView = {
    EMPTY_PAGE: false,
    MAIN_PAGE: false,
    CATEGORIES_LIST: false,
    PRODUCT_LIST: false,
    PRODUCT_PAGE: false,
  }

  switch (true) {
    case Array.isArray(state) && state.length == 0:
      typeView.EMPTY_PAGE = true
      return typeView
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
  constructor(container) {
    this._container = container

    // Обёртка контента
    this._wrap = null
    // Тип отображаемого контетна
    this._contentViewType = null
    // Корневой элемент контента
    this._containerElement = this._container.getElement()

    this._productControllers = []

    this._onDataChange = this._onDataChange.bind(this)
    this._removeProduct = this._removeProduct.bind(this)
    this._renderEmptyPage = this._renderEmptyPage.bind(this)
  }

  render() {
    $productList.watch((state) => this._onDataChange(state))
    $productList.watch(openCartPage, () => this._removeProduct())
    $productList.watch(closeCartPage, (state) => this._onDataChange(state))
    $productList.watch(changeProductListStateFromInput, (state) => this._onDataChange(state))
    $search.updates.watch((state) => {
    console.log('state :', state);
      return this._onDataChange(state)
    })
    // $search.watch((state) => console.log('store changed: ', state))
    // $search.watch(search, (state) => console.log('store changed: ', state))
    // searchList.watch((state) => this._onDataChange(state))
  }

  _renderProduct(settings, products, id = 0) {
    this._wrap = new ProductListComponent()
    // Создаём обёртку списка
    render(this._containerElement, this._wrap, RenderPosition.BEFOREEND)

    const productListElement = this._wrap.getElement()
    productListElement.id = id

    const newProducts = renderProducts(productListElement, settings, products)

    this._productControllers = this._productControllers.concat(newProducts)
  }

  _renderProductPage(settings, product) {
    const productPageController = new ProductPageController(
      this._containerElement
    )
    productPageController.render(settings, product)
    this._productControllers = this._productControllers.concat(
      productPageController
    )
  }

  _renderEmptyPage() {
    render(this._containerElement, this._wrap, RenderPosition.BEFOREEND)
    const productListElement = this._wrap.getElement()

    const emptyMessage = createElement(
      `<div class="market-content--fade-in market-content__empty">Ничего не найдено</div>`
    )
    const message = productListElement.querySelector('.market-content__empty')

    if (message === null) {
      productListElement.prepend(emptyMessage)
    }
  }

  _removeProduct() {
    remove(this._wrap)

    this._productControllers.forEach((productController) =>
      productController.destroy()
    )
    this._productControllers = []
  }

  _onDataChange(state) {
  // console.log('state :', state);
    if (this._productControllers.length !== 0) {
      this._removeProduct()
    }

    // Проверяем тип контента состояния
    this._contentViewType = getContentViewType(state)

    if (
      this._contentViewType.MAIN_PAGE ||
      this._contentViewType.CATEGORIES_LIST ||
      this._contentViewType.PRODUCT_LIST
    ) {
      this._renderProduct(setting, state, state.id)
    } else if (this._contentViewType.PRODUCT_PAGE) {
      this._renderProductPage(setting, state)
    } else {
      this._renderEmptyPage()
    }
  }
}
