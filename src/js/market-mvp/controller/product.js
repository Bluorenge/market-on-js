import { render, remove, RenderPosition } from '../utils/render.js'
import ProductItemComponent from '../components/product'

import { addMenuItem, changeProductListState } from '../models/products'

export default class ProductController {
  constructor(container) {
    this._container = container

    this._productComponent = null
  }

  render(setting, product) {
    this._productComponent = new ProductItemComponent(setting, product)
    render(this._container, this._productComponent, RenderPosition.BEFOREEND)
    const productWrap = this._productComponent.getElement()

    this._productComponent.setOpenButtonClickHandler(() => {
      const id = Number(productWrap.id.replace(/[^+\d]/g, ''))
      const name = productWrap.querySelector('.market-products__product-title')
        .textContent

      addMenuItem({ id, name })
      changeProductListState({ id, name })
    })
  }

  destroy() {
    remove(this._productComponent)
  }
}
