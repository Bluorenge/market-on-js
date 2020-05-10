import { findByName } from '../utils/filter'
import { deleteLastMenuItem } from '../menu/model-menu'

import { createEvent, createStore, sample } from 'effector'

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

// Список продуктов
export const productListData = productListParse()
export const $productList = createStore(productListData)

export const openCartPage = createEvent()

export const changeProductListState = createEvent()
export const findStateInDefaultState = createEvent()
export const closeCartPage = createEvent()

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
  .on(findStateInDefaultState, (state, data) => {
    state = findByName($productList.defaultState, data.id, data.name)
    return state ? state : $productList.defaultState
  })
  .on(closeCartPage, () => $productList.defaultState)

export const search = createEvent()
export const searchByDefault = createEvent()

// Обрабатываем состояние стора списка без изменения самого стора
export const searchList = sample($productList, search, (state, data) => {
  if (data.searchValue == '') {
    deleteLastMenuItem()
    'subCategory' in state ||
    'productsInCategory' in state ||
    Array.isArray(state)
      ? searchByDefault(state)
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