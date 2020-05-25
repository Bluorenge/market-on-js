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
    option: optionName
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
    item.option
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

// Проверка по имени есть ли товар в корзине
export const isItProductInCart = (cart, productName) =>
  cart.some((product) => product.name === productName)

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

// Имя первой активной опции
export const firstActiveOptionName = (options) => {
  const findingActiveObject = options.find((option) => {
    return Object.entries(option).map(([, value]) => value)[0]
  })
  return Object.getOwnPropertyNames(findingActiveObject)[0]
}
// Индекс первой активной опции товара
export const firstActiveOptionIndex = (product) => {
  return product.options.optionList.findIndex((option) => {
    return Object.entries(option).map(([, value]) => value)[0]
  })
}
// Выбираем цену первой активной опции
export const createPrice = (product) => {
  return `options` in product && product.options
    ? product.options.optionList
        .map((item, index) => {
          if (firstActiveOptionIndex(product) === index) {
            return item.price.toLocaleString(`ru-RU`)
          }
        })
        .join(``)
    : product.price.toLocaleString(`ru-RU`)
}

// Проверка, отобразился ли элемент на странице
export const elementReady = (parent, selector) => {
  return new Promise((resolve) => {
    let el = parent.querySelector(selector)
    if (el) {
      resolve(el)
    }
    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(parent.querySelectorAll(selector)).forEach((element) => {
        resolve(element)
        //Once we have resolved we don`t need the observer anymore.
        observer.disconnect()
      })
    }).observe(parent.documentElement, {
      childList: true,
      subtree: true,
    })
  })
}

const distanceBetweenElements = function (elementOne, elementTwo) {
  const x1 = elementOne.getBoundingClientRect().top
  const x2 = elementTwo.getBoundingClientRect().top

  const y1 = elementOne.getBoundingClientRect().left
  const y2 = elementTwo.getBoundingClientRect().left

  const xToX = Math.floor(x2 - x1)
  const yToY = Math.floor(y1 - y2)

  return { xToX, yToY }
}

const animate = function ({ timing, draw, duration }) {
  let start = performance.now()

  requestAnimationFrame(function animate(time) {
    // timeFraction изменяется от 0 до 1
    let timeFraction = (time - start) / duration
    if (timeFraction > 1) timeFraction = 1

    // вычисление текущего состояния анимации
    let progress = timing(timeFraction)

    draw(progress) // отрисовать её

    if (timeFraction < 1) {
      requestAnimationFrame(animate)
    }
  })
}

export const animationForAddProductToCart = (parentElement) => {
  const cart = document.querySelector('.market-cart-link__icon-wrap')
  const productPic = parentElement.querySelector(`img`)

  const cloneProductPic = productPic.cloneNode(true)
  cloneProductPic.classList.add(`market-product__animate`)

  const spaceBetween = distanceBetweenElements(cart, productPic)
  const entryTop = spaceBetween.xToX
  const entryLeft =
    productPic.getBoundingClientRect().left - productPic.offsetWidth

  cloneProductPic.style.top = entryTop + 'px'
  cloneProductPic.style.left = entryLeft + 'px'

  const marketWrap = parentElement.closest('.market')
  marketWrap.append(cloneProductPic)

  animate({
    duration: 1000,
    timing(timeFraction) {
      return timeFraction * (2 - timeFraction)
    },
    draw(progress) {
      const roundedToHundredth = function (number) {
        return +number.toFixed(3)
      }
      cloneProductPic.style.top =
        entryTop +
        roundedToHundredth(progress) * -spaceBetween.xToX +
        cart.offsetHeight / 2 +
        'px'
      cloneProductPic.style.left =
        entryLeft +
        roundedToHundredth(progress) * spaceBetween.yToY +
        cart.offsetWidth +
        'px'
    },
  })
  // setTimeout(() => cloneProductPic.remove(), 1000)
}
