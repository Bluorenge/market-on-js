import { render, replace, remove, RenderPosition } from '../utils/render.js'
import ProductPageComponent from '../components/product-page'

export default class ProductPageController {
  constructor(container, productsModel) {
    this._container = container
    this._productsModel = productsModel

    this._productPageComponent = null
  }

  render(setting, product) {
    // Присваиваем переменной в конструктуре экземляр КОМПОНЕНТА (представления)
    this._productPageComponent = new ProductPageComponent(setting, product)
    // Отрисовываем КОМПОНЕНТ в родительском контейнере
    render(
      this._container,
      this._productPageComponent,
      RenderPosition.BEFOREEND
    )
    const productElement = this._productPageComponent.getElement()
    productElement.id = product.id

    // Вешаем обработчик клика на КОМПОНЕНТ
    this._productPageComponent.setOrderButtonClickHandler(() => {
      const productPrice = productElement.querySelector(
        '.market-product__price'
      ).textContent
      const optionWrap = productElement.querySelector(
        '.market-product__option-wrap'
      )
      if (optionWrap !== null) {
        const optionName = productElement.querySelector(
          '.market-product__option-title'
        ).textContent
        const optionValue = productElement.querySelector(
          '.market-product__option-item--active'
        ).textContent
        // Добавляем товар в корзину
        this._productsModel.setProductToCart(
          product,
          productPrice,
          optionName,
          optionValue
        )
      } else {
        this._productsModel.setProductToCart(product, productPrice)
      }

      // const itemId = Number(productElement.id.replace(/[^+\d]/g, ''))
    })
  }

  destroy() {
    // Удаляем компонент
    remove(this._productPageComponent)
  }
}
