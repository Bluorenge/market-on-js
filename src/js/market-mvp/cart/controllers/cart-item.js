import { render, remove, RenderPosition } from '../../utils/render.js'
import CartItemComponent from '../components/cart-item'

import {
  updateQuantityOfProductInCart,
  deleteProductInCart,
} from '../model-cart'

import {
  findProductsInDefaultProductList,
  closeCartPage,
} from '../../products/model-products'

export default class CartItemController {
  constructor(container) {
    this._container = container

    this._CartItemComponent = null
  }

  render(setting, product) {
    this._CartItemComponent = new CartItemComponent(setting, product)
    render(this._container, this._CartItemComponent, RenderPosition.AFTERBEGIN)

    const productElement = this._CartItemComponent.getElement()

    const id = product.id
    const name = product.name

    productElement.id = id

    const quantityInput = this._CartItemComponent.getQuantityInputElement()
    const price = this._CartItemComponent.getTotalPriceElement()
    const quantityText = this._CartItemComponent.getPriceQuantity()

    this._CartItemComponent.setOpenProductHandler(() => {
      closeCartPage()
      findProductsInDefaultProductList({ id, name })
    })

    this._CartItemComponent.setQuantityDownHandler(() => {
      // Изначальное значение инпута
      const initialValue = quantityInput.value
      // Уменьшаем его
      quantityInput.value--
      // Проверяем допустимость изменения
      this._checkInputValue(quantityInput)
      // Если изменилось
      if (initialValue !== quantityInput.value) {
        quantityText.textContent = quantityInput.value
        price.textContent = product.price * quantityInput.value
        updateQuantityOfProductInCart({ product, quantityUp: false })
      }
    })

    this._CartItemComponent.setQuantityInputHandler(() =>
      this._checkInputValue(quantityInput)
    )

    this._CartItemComponent.setQuantityUpHandler(() => {
      quantityInput.value++
      quantityText.textContent = quantityInput.value
      price.textContent = product.price * quantityInput.value
      updateQuantityOfProductInCart({ product })
    })

    this._CartItemComponent.setDeleteProductHandler(() => {
      deleteProductInCart(product)
    })
  }

  destroy() {
    remove(this._CartItemComponent)
  }

  _checkInputValue(input) {
    // Если первый символ ноль
    if (input.value[0] === '0') {
      input.value = 1
    }
    // Если ввод пустой
    if (input.value === '') {
      input.value = 1
    }
    // Зачем-то ещё одна проверка (пока делал, забыл какой баг был)
    if (input.value < '0' || input.value > '9') {
      input.value = 1
    }
    // Запрещаем ввод букв
    input.value = input.value.replace(/\D/g, '')
  }
}
