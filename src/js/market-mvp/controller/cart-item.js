import { render, replace, remove, RenderPosition } from '../utils/render.js'
import CartItemComponent from '../components/cart-item'

import { cart, updateQuantityOfProductInCart, deleteProductInCart } from '../models/products'

export default class CartItemController {
  constructor(container) {
    this._container = container

    this._CartItemComponent = null
    // this._changeInput = this._changeInput.bind(this)
  }

  render(setting, product) {
    // Присваиваем переменной в конструктуре экземляр КОМПОНЕНТА (представления)
    this._CartItemComponent = new CartItemComponent(setting, product)
    // Отрисовываем КОМПОНЕНТ в родительском контейнере
    render(this._container, this._CartItemComponent, RenderPosition.AFTERBEGIN)
    const productElement = this._CartItemComponent.getElement()
    productElement.id = product.id

    const quantityInput = productElement.querySelector('.market-cart__quantity-input')
    const price = productElement.querySelector('.market-cart__product-total-price')
    const quantityText = productElement.querySelector('.market-cart__price-quantity')

    // Вешаем обработчик клика на КОМПОНЕНТ
    this._CartItemComponent.setQuantityDownHandler(() => {
      // Изначальное значение инпута
      const initialValue = quantityInput.value
      // Уменьшаем его
      quantityInput.value--
      // Проверяем изменение
      this._checkInputValue(quantityInput)
      // Если изменилось
      if (initialValue !== quantityInput.value) {
        quantityText.textContent = quantityInput.value
        price.textContent = product.price * quantityInput.value
        updateQuantityOfProductInCart({ product, quantityUp: false })
      }
    })

    this._CartItemComponent.setQuantityInputHandler(() => this._checkInputValue(quantityInput))

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
    // Удаляем компонент
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
