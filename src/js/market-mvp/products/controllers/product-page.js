import { render, remove, RenderPosition } from '../../utils/render.js'
import ProductPageComponent from '../components/product-page'

export default class ProductPageController {
  constructor(container, addToCart) {
    this._container = container
    this._addToCart = addToCart

    this._productPageComponent = null
  }

  render(setting, product) {
    this._productPageComponent = new ProductPageComponent(setting, product)
    render(
      this._container,
      this._productPageComponent,
      RenderPosition.BEFOREEND
    )

    const optionWrap = this._productPageComponent.getOptionWrapElement()
    let productPrice = this._productPageComponent.getPriceElement()

    this._productPageComponent.setOrderButtonClickHandler(() => {
      if (optionWrap) {
        const optionName = this._productPageComponent.getOptionTitleElement()
          .textContent
        const optionValue = this._productPageComponent.getActiveOptionElement()
          .textContent

        this._addToCart({
          product,
          productPrice: productPrice.textContent,
          optionName,
          optionValue,
        })
      } else {
        this._addToCart({
          product,
          productPrice: productPrice.textContent,
        })
      }
      this._productPageComponent.animationForAddProductToCart()
    })

    if (optionWrap) {
      this._productPageComponent.setOptionItemClickHandler(() => {
        const target = event.target
        this._productPageComponent.deleteActiveClassOption(target)
        const optionName = target.textContent
        // Находим цену опции
        const optionPrice = product.options.optionList.find(
          (option) => option[optionName]
        )
        productPrice.textContent = optionPrice.price
      })
    }
  }

  destroy() {
    remove(this._productPageComponent)
  }
}
