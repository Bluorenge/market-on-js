import { createEffect, createStore, sample } from 'effector'

import { eventsForStore } from './eventsForStore'

// Рекурсивный поиск одного элемента по всему массиву
const findByName = (arr, id, name) =>
  arr.reduce((a, item) => {
    // При первой итерации этот if пропускается, потому что передаётся null
    if (a) return a

    // Если текущий элемент массива содержит нужное имя, возращаем его. Если нет, то..
    if (item.id === id && item.name === name) return item

    // ..берём элемент с ключом nestingKey и снова ищём в нём нужное имя, либо..
    if (`subCategory` in item) return findByName(item.subCategory, id, name)

    // ..если нужно найти элемент в списке товаров в категории
    if (`productsInCategory` in item)
      return findByName(item.productsInCategory, id, name)
  }, null)

export const getContentViewType = (currentState, defaultState) => {
  let typeView
  switch (true) {
    case Array.isArray(currentState) && currentState.length == 0:
      typeView = `EMPTY_PAGE`
      break
    case currentState === defaultState:
      typeView = `MAIN_PAGE`
      break
    case `subCategory` in currentState:
      typeView = `CATEGORIES_LIST`
      break
    case `productsInCategory` in currentState:
      typeView = `PRODUCT_LIST`
      break
    case Array.isArray(currentState):
      typeView = `SEARCH_LIST`
      break
    default:
      typeView = `PRODUCT_PAGE`
      break
  }
  return typeView
}

export const awaitProducts = createEffect(`get products`, {
  handler: (value) => Promise.resolve(value),
})

export let $productList
export let searchList
export let productPage

awaitProducts.done.watch(({ result }) => {
  $productList = createStore(result)

  $productList
    .on(eventsForStore.changeProductListState, (state, data) => {
      switch (true) {
        case `subCategory` in state:
          return state.subCategory.find(
            (item) => item.id == data.id && item.name == data.name
          )
        case `productsInCategory` in state:
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
    .on(eventsForStore.findProductsInDefaultProductList, (state, data) => {
      state = findByName($productList.defaultState, data.id, data.name)
      return state ? state : $productList.defaultState
    })
    .reset(eventsForStore.toMainPage)

  // * нарушено правило чистой функции, чтобы вычесления производить здесь, а не в презентере
  searchList = sample($productList, eventsForStore.search, (state, data) => {
    if (data.searchValue == ``) {
      eventsForStore.deleteLastMenuItem()
      eventsForStore.productListToCurrentView(state)
    } else {
      switch (true) {
        case `subCategory` in state:
          return state.subCategory.filter((item) =>
            item.name.toLowerCase().includes(data.searchValue.toLowerCase())
          )
        case `productsInCategory` in state:
          return state.productsInCategory.filter((item) =>
            item.name.toLowerCase().includes(data.searchValue.toLowerCase())
          )
        // Если это главная страница
        case Array.isArray(state):
          return state.filter((item) =>
            item.name.toLowerCase().includes(data.searchValue.toLowerCase())
          )
        default:
          return false
      }
    }
  })

  productPage = sample(
    $productList,
    eventsForStore.openProductPage,
    (state) => state
  )
})
