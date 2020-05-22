import { render, remove, replace, RenderPosition } from '../../utils/render.js'
import { eventsForStore } from '../../utils/eventsForStore'
import {
  firstActiveOptionName,
  animationForAddProductToCart,
} from '../../utils/utils'

import ListItemComponent from '../components/list-item'

export default class ListItemController {
  constructor(container, setting, option) {
    this._container = container
    this._setting = setting
    this._option = option

    this._productComponent = null
  }

  render(product) {
    this._productComponent = new ListItemComponent(
      this._setting,
      this._option,
      product
    )
    render(this._container, this._productComponent, RenderPosition.BEFOREEND)
    this._initHandler(product)
  }

  destroy() {
    remove(this._productComponent)
  }

  getComponent() {
    return this._productComponent.getElement()
  }

  _initHandler(product) {
    const id = Number(
      this._productComponent.getElement().id.replace(/[^+\d]/g, ``)
    )
    const name = this._productComponent.getItemNameElement().textContent

    // При открытии элемента списка:
    this._productComponent.setOpenButtonClickHandler(() => {
      eventsForStore.clearSearchInput()
      eventsForStore.addMenuItem({ id, name })
      eventsForStore.changeProductListState({ id, name })
    })

    const isProduct = `price` in product

    if (isProduct) {
      const productPrice = Number(
        this._productComponent
          .getProductPriceElement()
          .textContent.replace(/[^+\d]/g, ``)
      )
      const productData = {
        product,
        productPrice,
        optionName: product.options?.nameOptionList,
        optionValue: product.options
          ? firstActiveOptionName(product.options.optionList)
          : undefined,
      }

      // Добавляем товар в корзину
      this._productComponent.setAddToCartBtnClickHandler(() => {
        eventsForStore.addToCart(productData)
        this._replace(product)
      })

      if (this._option.oneClickOrder && `options` in product == false) {
        this._productComponent.setOneClickOrderBtnClickHandler(() => {
          eventsForStore.addToCart(productData)
          if (!this._option.oneClickOrderCustom) {
            eventsForStore.openCartPage()
          } else {
            eventsForStore.oneClickOrder({ productData })
          }
        })
      }
    }
  }

  _replace(product) {
    const newViewOfListItem = new ListItemComponent(
      this._setting,
      this._option,
      product
    )
    replace(newViewOfListItem, this._productComponent)
    this._productComponent = newViewOfListItem
    animationForAddProductToCart(this._productComponent.getElement())
    this._initHandler(product)
  }
}
