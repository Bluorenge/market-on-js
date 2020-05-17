import { findByName } from '../utils/filter'
import { createEffect, restore, combine, createStore, sample } from 'effector'
import { eventsForStore } from '../main/eventsForStore'

export const awaitProducts = createEffect('get products', {
  handler: (value) => Promise.resolve(value),
})

export let $productList
export let searchList

awaitProducts.done.watch(({ result, params }) => {
  $productList = createStore(result)

  $productList
    .on(eventsForStore.changeProductListState, (state, data) => {
      console.log('state :', state)
      console.log('data :', data)
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
    .on(eventsForStore.findProductsInDefaultProductList, (state, data) => {
      state = findByName($productList.defaultState, data.id, data.name)
      return state ? state : $productList.defaultState
    })
    .reset(eventsForStore.toDefaultState)

  searchList = sample($productList, eventsForStore.search, (state, data) => {
    if (data.searchValue == '') {
      eventsForStore.deleteLastMenuItem()
      'subCategory' in state ||
      'productsInCategory' in state ||
      Array.isArray(state)
        ? eventsForStore.searchByDefault(state)
        : false
    } else {
      switch (true) {
        case 'subCategory' in state:
          return state.subCategory.filter((item) =>
            item.name.toLowerCase().includes(data.searchValue.toLowerCase())
          )
        case 'productsInCategory' in state:
          return state.productsInCategory.filter((item) =>
            item.name.toLowerCase().includes(data.searchValue.toLowerCase())
          )
        case Array.isArray(state):
          return state.filter((item) =>
            item.name.toLowerCase().includes(data.searchValue.toLowerCase())
          )
        default:
          return false
      }
    }
  })
})
