import { render, remove, RenderPosition } from '../../utils/render.js'

import ProductController from './product'
import ProductPageController from './product-page'

import ProductListComponent from '../components/product-list'
import BtnPrevComponent from '../components/btn-prev'
import EmptyMessageComponent from '../components/empty-message'

import { $menu, deleteLastMenuItem } from '../../menu/model-menu'

import {
  setting,
  $productList,
  openCartPage,
  closeCartPage,
  searchList,
  searchByDefault,
  findStateInDefaultState,
} from '../model-products'

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
    this._btnPrevComponent = null
    this._emptyTextComponent = null

    this._onDataChange = this._onDataChange.bind(this)
    this._removeProduct = this._removeProduct.bind(this)
    this._renderEmptyPage = this._renderEmptyPage.bind(this)
  }

  render() {
    $productList.watch((state) => this._onDataChange(state))
    $productList.watch(openCartPage, () => this._removeProduct())
    $productList.watch(closeCartPage, (state) => this._onDataChange(state))
    $productList.watch(searchByDefault, (state) => this._onDataChange(state))
    searchList.watch((state) => (state ? this._onDataChange(state) : false))
  }

  _renderProduct(settings, products, id = 0, isMainPage = true) {
    this._wrap = new ProductListComponent()
    render(this._containerElement, this._wrap, RenderPosition.BEFOREEND)

    const productListElement = this._wrap.getElement()
    productListElement.id = id

    const newProducts = renderProducts(productListElement, settings, products)

    this._productControllers = this._productControllers.concat(newProducts)

    if (!isMainPage) {
      this._btnPrevComponent = new BtnPrevComponent()
      render(
        this._containerElement,
        this._btnPrevComponent,
        RenderPosition.BEFOREEND
      )
      this._btnPrevComponent.setPrevBtnHandler(() => {
        const menu = $menu.getState()

        const id = menu[menu.length - 2].id
        const name = menu[menu.length - 2].name
        deleteLastMenuItem()
        findStateInDefaultState({ id, name })
      })
    }
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
    this._emptyTextComponent = new EmptyMessageComponent()

    if (this._emptyTextComponent) {
      render(
        this._containerElement,
        this._emptyTextComponent,
        RenderPosition.BEFOREEND
      )
    }
  }

  _removeProduct() {
    remove(this._wrap)
    if (this._btnPrevComponent) {
      remove(this._btnPrevComponent)
    }
    this._productControllers.forEach((productController) =>
      productController.destroy()
    )
    this._productControllers = []
  }

  _onDataChange(state) {
    if (this._productControllers.length) {
      this._removeProduct()
    }

    if (this._emptyTextComponent) {
      remove(this._emptyTextComponent)
    }

    this._contentViewType = getContentViewType(state)

    if (this._contentViewType.MAIN_PAGE) {
      this._renderProduct(setting, state, state.id)
    } else if (
      this._contentViewType.CATEGORIES_LIST ||
      this._contentViewType.PRODUCT_LIST
    ) {
      this._renderProduct(setting, state, state.id, false)
    } else if (this._contentViewType.PRODUCT_PAGE) {
      this._renderProductPage(setting, state)
    } else {
      this._renderEmptyPage()
    }
  }
}
