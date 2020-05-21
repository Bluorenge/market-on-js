import { render, remove, RenderPosition } from '../../utils/render.js'
import ProductItemComponent from '../components/product'
import { firstActiveOptionName } from '../../utils/utils'

import { eventsForStore } from '../../main/eventsForStore'

export default class ListItemController {
  constructor(container) {
    this._container = container

    this._productComponent = null
  }

  render(setting, option, product) {
    this._productComponent = new ProductItemComponent(setting, option, product)
    render(this._container, this._productComponent, RenderPosition.BEFOREEND)
    const productWrap = this._productComponent.getElement()

    const id = Number(productWrap.id.replace(/[^+\d]/g, ``))
    const name = this._productComponent.getProductNameElement().textContent

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

      this._productComponent.setAddToCartBtnClickHandler(() => {
        eventsForStore.addToCart(productData)
      })

      if (option.oneClickOrder && !product.hasOwnProperty(`options`)) {
        this._productComponent.setOneClickOrderBtnClickHandler(() => {
          eventsForStore.addToCart(productData)
          eventsForStore.openCartPage()
        })
      }
    }
  }

  destroy() {
    remove(this._productComponent)
  }

  getComponent() {
    return this._productComponent.getElement()
  }
}
