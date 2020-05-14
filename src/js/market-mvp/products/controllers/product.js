import { render, remove, RenderPosition } from '../../utils/render.js'
import ProductItemComponent from '../components/product'

import {
  $menu,
  isSearchMenu,
  deleteLastMenuItem,
  addMenuItem,
} from '../../menu/model-menu'
import { changeProductListState } from '../model-products'

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
      if (isSearchMenu($menu.getState())) {
        deleteLastMenuItem()
      }

      const id = Number(productWrap.id.replace(/[^+\d]/g, ''))
      const name = this._productComponent.getProductNameElement().textContent

      addMenuItem({ id, name })
      changeProductListState({ id, name })
    })
  }

  destroy() {
    remove(this._productComponent)
  }

  getComponent() {
    return this._productComponent.getElement()
  }
}
