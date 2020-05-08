import { render, remove, RenderPosition } from '../utils/render.js'
import ProductPageComponent from '../components/product-page'

import { addToCart } from '../models/products'

export default class ProductPageController {
  constructor(container) {
    this._container = container

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

    const optionWrap = this._productPageComponent.getOptionWrap()
    let productPrice = productElement.querySelector('.market-product__price')

    this._productPageComponent.setOrderButtonClickHandler(() => {
      if (optionWrap !== null) {
        const optionName = productElement.querySelector(
          '.market-product__option-title'
        ).textContent
        const optionValue = productElement.querySelector(
          '.market-product__option-item--active'
        ).textContent

        addToCart({
          product,
          productPrice: productPrice.textContent,
          optionName,
          optionValue,
        })
      } else {
        addToCart({ product, productPrice: productPrice.textContent })
      }
      this._animationForAddProductToCart(productElement)
    })

    if (optionWrap !== null) {
      const optionBtns = optionWrap.querySelectorAll(
        '.market-product__option-item:not(.market-product__option-item--disabled)'
      )

      this._productPageComponent.setOptionWrapClickHandler(() => {
        const target = event.target
        // Удаляем у всех опций активный класс
        optionBtns.forEach((item) =>
          item.classList.remove('market-product__option-item--active')
        )
        target.classList.toggle('market-product__option-item--active')
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

  _animationForAddProductToCart(parentElement) {
    const productPic = parentElement.querySelector(
      '.market-product__img-wrap img'
    )
    // Клонируем его
    const cloneProductPic = productPic.cloneNode(true)
    cloneProductPic.classList.add('market-product__animate')
    // Вставляем копию картинки после картинки
    productPic.after(cloneProductPic)
  }
}
