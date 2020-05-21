import { render, remove, RenderPosition } from '../../utils/render.js'

import ProductPageComponent from '../components/product-page'

import { eventsForStore } from '../../main/eventsForStore'
import { productPage, $productList } from '../../products/model-products'

export default class ProductPageController {
  constructor(container, setting) {
    this._container = container
    this._setting = setting

    this._productPageComponent = null
    // Наблюдаем за появлением стора с продуктом
    productPage.watch((state) => {
      this._renderCartPage(this._setting, state)
    })
    $productList.watch(() => this._removeCartPage())
    eventsForStore.openCartPage.watch(() => this._removeCartPage())
  }

  _renderCartPage(setting, product) {
    eventsForStore.disabledSearch()

    this._productPageComponent = new ProductPageComponent(setting, product)
    render(
      this._container.getElement(),
      this._productPageComponent,
      RenderPosition.BEFOREEND
    )

    let productPrice = this._productPageComponent.getPriceElement()

    this._productPageComponent.setOrderButtonClickHandler(() => {
      const optionName = this._productPageComponent.getOptionTitleElement()
      const optionValue = this._productPageComponent.getActiveOptionElement()

      eventsForStore.addToCart({
        product,
        productPrice: productPrice.textContent,
        optionName: optionName ? optionName.textContent : undefined,
        optionValue: optionValue ? optionValue.textContent : undefined,
      })
      this._productPageComponent.animationForAddProductToCart()
    })

    const optionWrap = this._productPageComponent.getOptionWrapElement()

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

  _removeCartPage() {
    if (this._productPageComponent) {
      remove(this._productPageComponent)
    }
    eventsForStore.enabledSearch()
  }
}
