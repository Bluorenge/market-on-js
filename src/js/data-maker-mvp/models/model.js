import { createStore, sample } from 'effector'
import { eventsForDataMaker } from './eventsForDataMaker'
import * as findAnd from 'find-and'
import { parentId } from '../utils/utils'

// Рекурсивный поиск одного элемента по всему массиву
const findByName = (arr, id) =>
  arr.reduce((a, item) => {
    // При первой итерации этот if пропускается, потому что передаётся null
    if (a) {
      return a
    }

    // Если текущий элемент массива содержит нужное имя, возращаем его. Если нет, то..
    if (item.id === id) {
      return item
    }

    // ..берём элемент с ключом nestingKey и снова ищём в нём нужное имя, либо..
    if (`subCategory` in item) {
      return findByName(item.subCategory, id)
    }

    // ..если нужно найти элемент в списке товаров в категории
    if (`productsInCategory` in item) {
      return findByName(item.productsInCategory, id)
    }
  }, null)

export let currentValue = { id: 1 }
export let menuList = []

export const $settingOfMarket = createStore(null)
$settingOfMarket.on(eventsForDataMaker.updateSetting, (state, data) => {
  return {
    id: data.id,
    currency: data.currency,
  }
})

export const $idContent = createStore(1)
$idContent.on(eventsForDataMaker.idContentIncrease, state => {
  state++
  return state
})

export const $isFormValidate = createStore(false)
$isFormValidate.on(eventsForDataMaker.toggleValidate, (_, isValidate) => isValidate)

export const $productList = createStore([])
$productList
  .on(eventsForDataMaker.makeCategory, (state, data) => {
    const find = findByName(state, data.id)
    if (!find) {
      state.push({
        id: data.id,
        name: data.item.name,
        img: data.item.img,
      })
    } else {
      state = findAnd.replaceObject(
        state,
        { id: data.id },
        {
          id: data.id,
          name: data.item.name,
          img: data.item.img,
        },
      )
    }
    console.log('state :', state)
    return state
  })
  .on(eventsForDataMaker.makeProduct, (state, data) => {
    console.log('data :', data)
    const foundProduct = findByName(state, data.id)
    const parentElId = parentId(state, data.id)

    // Если товара не существует и у него нет родителя
    if (!foundProduct && !parentElId) {
      state.push({
        id: data.id,
        name: data.item?.name,
        img: data.item?.img,
        price: data.item?.price,
      })
    }
    // Если нашли товар
    else if (foundProduct) {
      state = findAnd.replaceObject(
        state,
        { id: foundProduct.id },
        {
          id: data.id,
          name: data.item?.name,
          img: data.item?.img,
          price: data.item?.price,
        },
      )
    }
    // Если есть родитель
    else if (parentElId) {
      // Ищем родителя
      const founndParent = findByName(state, parentElId.id)

      // Если не нашли
      if (!founndParent.productsInCategory) {
        foundProduct.productsInCategory = []
        foundProduct.productsInCategory.push({
          id: data.id,
          name: data.item?.name,
          img: data.item?.img,
          price: data.item?.price,
        })
      } else {
        state = findAnd.replaceObject(
          state,
          { id: founndParent.id },
          {
            id: data.id,
            name: data.item?.name,
            img: data.item?.img,
            price: data.item?.price,
          },
        )
      }
    }

    if (foundProduct?.desc) {
      eventsForDataMaker.makeDesc(data)
    }
    console.log('state :', state)
    return state
  })
  .on(eventsForDataMaker.makeDesc, (state, data) => {
    const find = findByName(state, data.id)
    if (!find.desc) {
      find.desc = data.desc
    }
  })
  .on(eventsForDataMaker.deleteDesc, (state, data) => {
    const find = findByName(state, data.id)
    find.desc = undefined
  })
  .on(eventsForDataMaker.deleteProduct, (state, data) => {
    // const find = findByName(state, data.id)
    state = findAnd.removeObject(state, { id: data.id })
    return state
  })
export const findCategory = $productList
  .map(_ => undefined)
  .on(eventsForDataMaker.searchItem, (_, data) => {
    const find = findByName($productList.getState(), data.id)
    return find
  })

export const $typeView = createStore(`setting`)
$typeView.on(eventsForDataMaker.changeView, (_, type) => type)
