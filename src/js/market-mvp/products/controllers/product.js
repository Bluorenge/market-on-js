import { render, remove, RenderPosition } from '../../utils/render.js'
import ProductItemComponent from '../components/product'

export default class ProductController {
  constructor(container, onDataChange) {
    this._container = container
    this._onDataChange = onDataChange

    this._productComponent = null
  }

  render(setting, product) {
    this._productComponent = new ProductItemComponent(setting, product)
    render(this._container, this._productComponent, RenderPosition.BEFOREEND)
    const productWrap = this._productComponent.getElement()

    this._productComponent.setOpenButtonClickHandler(() => {
      const id = Number(productWrap.id.replace(/[^+\d]/g, ''))
      const name = this._productComponent.getProductNameElement().textContent
      this._onDataChange({ id, name })
    })
  }

  destroy() {
    remove(this._productComponent)
  }

  getComponent() {
    return this._productComponent.getElement()
  }
}
