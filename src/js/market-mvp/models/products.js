import { inputFindProduct, menuPath, findByName } from '../utils/filter'
import { newProductCartArr, newProductCart } from '../utils/utils'

import { createEvent, createStore, forward, sample } from 'effector'

const entryMenu = [{ id: 0, name: 'Главная' }]

export const settingParse = (data) => {
  const dataParse = JSON.parse(data)
  return dataParse
}

export const setting = settingParse('{"userId": "557933","currency": "р."}')

export const productListParse = () => {
  const dataParse = JSON.parse(
    '[{"id":1,"name":"Футболки","img":"1.png","subCategory":[{"id":2,"name":"Крутые","img":"1.png","productsInCategory":[{"id":3,"name":"Крутая первая","price":"1200","img":"1.png","active":true,"desc":"Состав: чистая крутость<br />Ваще круть","options":{"nameOptionList":"Степень крутости","optionList":[{"1":true,"price":"1200"},{"2":true,"price":"300"},{"100500":true,"price":"800"}]}},{"id":4,"name":"Крутая вторая","price":"1300","img":"2.png"}]},{"id":5,"name":"Не оч крутые","img":"2.png","productsInCategory":[{"id":6,"name":"Ну такая первая","price":"800","img":"1.png","active":true,"desc":"Состав: посредственность<br />Пойдёт","options":{"nameOptionList":"Степень обычности","optionList":[{"-1":true,"price":"800"},{"-2":true,"price":"300"},{"-100500":true,"price":"800"}]}}]}]},{"id":7,"name":"Толстковки","img":"1.png","subCategory":[{"id":8,"name":"Крутые2","img":"1.png","subCategory":[{"id":9,"name":"Крутые3","img":"1.png","productsInCategory":[{"id":10,"name":"Крутая первая толст","price":"1200","img":"1.png","desc":"Состав: чистая крутость<br />Ваще круть","active":true,"options":{"nameOptionList":"Степень крутости","optionList":[{"1":true,"price":"1200"},{"2":true,"price":"300"},{"100500":true,"price":"800"}]}},{"id":11,"name":"Крутая вторая толст","price":"1300","img":"2.png","active":true}]}]},{"id":12,"name":"Не оч крутыеТол","img":"2.png","productsInCategory":[{"id":13,"name":"Ну такая первая","price":"800","img":"1.png","desc":"Состав: посредственность<br />Пойдёт","active":true,"options":{"nameOptionList":"Степень обычности","optionList":[{"-1":true,"price":"800"},{"-2":true,"price":"300"},{"-100500":true,"price":"1800"}]}}]}]},{"id":14,"name":"Суперск","price":"6000","img":"1.png","active":true},{"id":15,"name":"Ееее","price":"200","img":"2.png","desc":"Состав: ееее.<br />Ееее ее е ееее.","active":false,"options":{"nameOptionList":"Е","optionList":[{"е":true,"price":"200"},{"ее":false,"price":"300"},{"еее":true,"price":"800"}]}}]'
  )
  return dataParse
}

export const menuStore = () => {
  const menuEntry = [{ id: 0, name: 'Главная' }]
  const menuStore = createStore(menuEntry)
  return menuStore
}

// Меню
export const $menu = menuStore()

export const addMenuItem = createEvent()
export const createMenuPath = createEvent()
export const removeMenuItemsTo = createEvent()
export const createCartMenu = createEvent()

export const openCartPage = createEvent()
export const closeCartPage = createEvent()

$menu
  .on(addMenuItem, (state, menuItem) => [...state, menuItem])
  .on(removeMenuItemsTo, (state, data) => {
    const indexMenuItem = state.findIndex((item) => item.id === data.id)
    return state.slice(0, indexMenuItem + 1)
  })
  .on(createMenuPath, (state, data) =>
    [...entryMenu].concat(menuPath(productListData, data.id, data.name))
  )
  .on(createCartMenu, () => [...entryMenu].concat({ name: 'Корзина' }))

// Список продуктов
const productListData = productListParse()
export const $productList = createStore(productListData)

export const changeProductListState = createEvent()
export const changeProductListStateFromMenu = createEvent()
export const changeProductListStateFromInput = createEvent()

export const $search = createStore([])
export const search = createEvent()

// При срабатывании события поиска, обновляем стор поиска
// ? возможно производительней метод с sample()
// С другой стороны, в этом случае можно вернуться к результат поиска, потому что стор сохранён
forward({
  from: search,
  to: $search,
})

$productList
  .on(changeProductListState, (state, data) => {
    switch (true) {
      case 'subCategory' in state:
        return state.subCategory.find(
          (item) => item.id == data.id && item.name == data.name
        )
      case 'productsInCategory' in state:
        return state.productsInCategory.find(
          (item) => item.id == data.id && item.name == data.name
        )
      case Array.isArray(state):
        return state.find(
          (item) => item.id == data.id && item.name == data.name
        )
      default:
        return state.defaultState
    }
  })
  .on(changeProductListStateFromMenu, (state, data) => {
    state = findByName($productList.defaultState, data.id, data.name)
    if (state === undefined) {
      return $productList.defaultState
    } else {
      return state
    }
  })
  .on(changeProductListStateFromInput, (state, data) => {
    console.log($search);
    // Если поле поиска очищено
    if (data.searchValue == '') {
      // Возвращаем последнее состояние
      return state
    }
    // Иначе вызываем событие поиска
    else {
      switch (true) {
        case 'subCategory' in state:
          search(inputFindProduct(state.subCategory, data.searchValue))
          break
        case 'productsInCategory' in state:
          search(inputFindProduct(state.productsInCategory, data.searchValue))
          break
        case Array.isArray(state):
          search(inputFindProduct(state, data.searchValue))
          break
      }
    }
  })
  .on(closeCartPage, () => $productList.defaultState)

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
      if (product.option !== undefined) {
        // Если уже есть такой же товар
        if (product.id === data.id && product.name === data.name) {
          // То удаляем товар с переданной опцией
          return product.option.optionValue !== data.option.optionValue
        } else {
          return true
        }
      } else {
        return product.id !== data.id && product.name !== data.name
      }
    })
  )
