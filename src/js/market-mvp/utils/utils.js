// Создание [] с товарами и их отрисовка в миниатюре
export const newProductCart = (
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
    id: product.id,
    option:
      optionName !== undefined
        ? {
            optionName: optionName,
            optionValue: optionValue,
          }
        : undefined,
    quantity: 1,
  }
  return newProductCart
}
export const newProductCartArr = (
  productArr,
  newProduct,
  quantityUp = true
) => {
  // Проверяем существует ли товар {newProductCart} в корзине [cart]
  const existingProduct = productArr.find((item) =>
    item.option !== undefined
      ? item.name === newProduct.name &&
        item.id === newProduct.id &&
        item.option.optionValue === newProduct.option.optionValue
      : item.name === newProduct.name && item.id === newProduct.id
  )

  // Если товар {newProduct} существует, то увеличиваем количество quantity этого объекта
  if (existingProduct) {
    quantityUp ? existingProduct.quantity++ : existingProduct.quantity--
    // Если не присвоить копию оригиналу, то не сработает слушатель изменения корзины
    productArr = [...productArr]
  }
  // Иначе присоединяем этот объект к [productArr]
  else {
    productArr = productArr.concat(newProduct)
  }
  return productArr
}

// Функция задержки выполнения функции
export const debounce = (func, wait, immediate) => {
  let timeout

  return function () {
    let context = this,
      args = arguments
    let callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }, wait)

    if (callNow) func.apply(context, args)
  }
}
