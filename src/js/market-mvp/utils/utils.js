// Создание [] с товарами и их отрисовка в миниатюре
export const addProductToCart = (
  cart,
  product,
  productPrice,
  optionName,
  optionValue
) => {
  // Объект c инфой о выбранном товаре
  const newProductCart = {
    name: product.name,
    img: product.img,
    price: productPrice,
    option:
      optionName !== undefined
        ? {
            optionName: optionName,
            optionValue: optionValue,
          }
        : undefined,
    quantity: 1,
  }

  // Проверяем существует ли товар {newProductCart} в корзине [cart]
  const existingProduct = cart.find((item) =>
    item.option !== undefined
      ? item.name === newProductCart.name &&
        item.option.optionValue === optionValue
      : item.name === newProductCart.name
  )

  // Если товар {newProductCart} существует, то увеличиваем количество quantity этого объекта
  if (existingProduct) {
    existingProduct.quantity++
  }
  // Иначе присоединяем этот объект к [cart]
  else {
    cart = cart.concat(newProductCart)
  }
  return cart
}
