import { render, remove, RenderPosition } from '../../utils/render'

import { elementReady, carousel } from '../../utils/utils'

import ProductController from './product'
import ProductPageController from './product-page'

import ProductListComponent from '../components/product-list'
import BtnPrevComponent from '../components/btn-prev'
import EmptyMessageComponent from '../components/empty-message'
import CarouselDotsComponent from '../components/carousel-dots'
import { eventsForStore } from '../../main/eventsForStore'

const renderProducts = (
  productListElement,
  setting,
  products,
  onDataChange
) => {
  const createArrayOfProductControllers = (arr) => {
    return arr.map((item) => {
      const productController = new ProductController(
        productListElement,
        onDataChange
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

const getContentViewType = (currentState, defaultState) => {
  const typeView = {
    EMPTY_PAGE: false,
    MAIN_PAGE: false,
    CATEGORIES_LIST: false,
    PRODUCT_LIST: false,
    SEARCH_LIST: false,
    PRODUCT_PAGE: false,
  }

  switch (true) {
    case Array.isArray(currentState) && currentState.length == 0:
      typeView.EMPTY_PAGE = true
      break
    case currentState === defaultState:
      typeView.MAIN_PAGE = true
      break
    case 'subCategory' in currentState:
      typeView.CATEGORIES_LIST = true
      break
    case 'productsInCategory' in currentState:
      typeView.PRODUCT_LIST = true
      break
    case Array.isArray(currentState):
      typeView.SEARCH_LIST = true
      break
    default:
      typeView.PRODUCT_PAGE = true
      break
  }
  return typeView
}
import { $productList, searchList } from '../model-products'
import { $menu, isSearchMenu } from '../../menu/model-menu'

export default class ProductListController {
  constructor(...args) {
    this._container = args[0]
    this._options = args[1]
    this._setting = args[2]

    this._wrap = null
    this._contentViewType = null
    this._containerElement = this._container.getElement()

    this._productsControllers = []
    this._btnPrevComponent = null
    this._emptyTextComponent = null
    this._dotsForCarouselComponent = null

    this._onItemOpen = this._onItemOpen.bind(this)
    this._onProductAddToCart = this._onProductAddToCart.bind(this)
  }

  render() {
    $productList.watch((currentState) => this._onDataChange(currentState))
    $productList.watch(eventsForStore.openCartPage, () => this._removeProduct())
    $productList.watch(eventsForStore.toDefaultState, (currentState) =>
      this._onDataChange(currentState)
    )
    $productList.watch(
      eventsForStore.findProductsInDefaultProductList,
      (currentState) => this._onDataChange(currentState)
    )
    $productList.watch(eventsForStore.searchByDefault, (currentState) =>
      this._onDataChange(currentState)
    )
    searchList.watch((currentState) =>
      currentState ? this._onDataChange(currentState) : false
    )
  }

  _renderProductList(settings, products, isMainPage = true) {
    this._wrap = new ProductListComponent()
    render(this._containerElement, this._wrap, RenderPosition.BEFOREEND)

    const newProducts = renderProducts(
      this._wrap.getElement(),
      settings,
      products,
      this._onItemOpen
    )

    this._productsControllers = this._productsControllers.concat(newProducts)

    // elementReady работает только по классу
    elementReady(
      this._containerElement,
      `.${this._wrap.getElement().classList[0]}`
    ).then(() => {
      const width = this._productsControllers.reduce(
        (acc, item) => acc + item.getComponent().offsetWidth,
        0
      )
      if (!this._dotsForCarouselComponent) {
        this._dotsForCarouselComponent = new CarouselDotsComponent()
        render(
          this._containerElement,
          this._dotsForCarouselComponent,
          RenderPosition.AFTERBEGIN
        )
      }
      carousel(
        this._options,
        this._containerElement,
        this._wrap.getElement(),
        width
      )
    })

    if (!isMainPage) {
      this._renderPrevBtn()
    }
  }

  _renderProductPage(settings, product) {
    const productPageController = new ProductPageController(
      this._containerElement,
      this._onProductAddToCart
    )
    productPageController.render(settings, product)
    this._productsControllers = this._productsControllers.concat(
      productPageController
    )
    this._renderPrevBtn()
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

  _renderPrevBtn(sd) {
    this._btnPrevComponent = new BtnPrevComponent()
    render(
      this._containerElement,
      this._btnPrevComponent,
      RenderPosition.BEFOREEND
    )
    this._btnPrevComponent.setPrevBtnHandler(() => {
      eventsForStore.deleteLastMenuItem()
      let menu = $menu.getState()
      const id = menu[menu.length - 1].id
      const name = menu[menu.length - 1].name
      eventsForStore.findProductsInDefaultProductList({ id, name })
    })
  }

  _removeProduct() {
    remove(this._wrap)
    if (this._btnPrevComponent) {
      remove(this._btnPrevComponent)
    }
    if (this._dotsForCarouselComponent) {
      remove(this._dotsForCarouselComponent)
      this._dotsForCarouselComponent = null
      this._containerElement.classList.remove('market-content--shadow')
    }
    this._productsControllers.forEach((productController) =>
      productController.destroy()
    )
    this._productsControllers = []
  }

  _onDataChange(currentState) {
    if (this._productsControllers.length > 0) {
      this._removeProduct()
    }

    if (this._emptyTextComponent) {
      remove(this._emptyTextComponent)
    }

    this._contentViewType = getContentViewType(
      currentState,
      $productList.defaultState
    )

    if (this._contentViewType.MAIN_PAGE) {
      this._renderProductList(this._setting, currentState)
    } else if (
      this._contentViewType.CATEGORIES_LIST ||
      this._contentViewType.PRODUCT_LIST ||
      this._contentViewType.SEARCH_LIST
    ) {
      this._renderProductList(this._setting, currentState, false)
    } else if (this._contentViewType.PRODUCT_PAGE) {
      this._renderProductPage(this._setting, currentState)
    } else {
      this._renderEmptyPage()
    }
  }

  _onItemOpen(data) {
    if (isSearchMenu($menu.getState())) {
      eventsForStore.deleteLastMenuItem()
    }
    eventsForStore.addMenuItem(data)
    eventsForStore.changeProductListState(data)
  }

  _onProductAddToCart(data) {
    eventsForStore.addToCart(data)
  }
}
