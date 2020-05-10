import { newProductCartArr, newProductCart } from '../utils/utils'
import { createEvent, createStore } from 'effector'

// Корзина
export const $cart = createStore([])

export const addToCart = createEvent()
export const updateQuantityOfProductInCart = createEvent()
export const deleteProductInCart = createEvent()

$cart
  .on(addToCart, (state, data) => {
    const product = newProductCart(
      data.product,
      data.productPrice,
      data.optionName,
      data.optionValue
    )
    return newProductCartArr(state, product).reverse()
  })
  .on(updateQuantityOfProductInCart, (state, data) =>
    newProductCartArr(state, data.product, data.quantityUp)
  )
  .on(deleteProductInCart, (state, data) =>
    state.filter((product) => {
      // Если есть опции
      return product.option
        ? // Если уже есть такой же товар
          product.id === data.id && product.name === data.name
          ? // То удаляем товар с переданной опцией
            product.option.optionValue !== data.option.optionValue
          : true
        : product.id !== data.id && product.name !== data.name
    })
  )
