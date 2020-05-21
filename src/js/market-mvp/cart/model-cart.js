import { newProductCartArr, newProductCart } from '../utils/utils'
import { createStore } from 'effector'
import { eventsForStore } from '../main/eventsForStore'

export const $cart = createStore([])

$cart
  .on(eventsForStore.addToCart, (state, data) => {
    const product = newProductCart(
      data.product,
      data.productPrice,
      data.optionName,
      data.optionValue
    )
    return newProductCartArr(state, product).reverse()
  })
  .on(eventsForStore.updateQuantityOfProductInCart, (state, data) =>
    newProductCartArr(state, data.product, data.quantityUp)
  )
  .on(eventsForStore.deleteProductInCart, (state, data) =>
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
