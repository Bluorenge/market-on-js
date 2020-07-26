import { createStore } from 'effector'
import { eventsForStore } from './eventsForStore'
import { $productList } from './products'

// Путь к элементу (для меню из поиска)
const menuPath = (arr, id, name) => {
  let items = []
  let continueFind = true
  const pushData = (arr, id, name) => {
    arr.push({
      id,
      name,
    })
  }

  const find = (arr, findId, findName) => {
    arr.find(item => {
      if (item.id === findId && item.name === findName) {
        // Добавлять или нет айди и имя найденного элемента
        pushData(items, item.id, item.name)
        continueFind = false
      } else if (continueFind) {
        if (`subCategory` in item) {
          // Если в этой ветке содержится нужный элемент
          const there = newItem =>
            newItem.some(product => {
              if (product.id === findId && product.name === findName) {
                pushData(items, item.id, item.name)
              } else if (`subCategory` in product) {
                there(product.subCategory)
              } else if (`productsInCategory` in product) {
                there(product.productsInCategory)
              }
            })
          there(item.subCategory)
          return find(item.subCategory, findId, findName)
        }
        if (`productsInCategory` in item) {
          // Если в этой категории содержится нужный элемент
          const there = item.productsInCategory.some(
            product => product.id === findId && product.name === findName,
          )
          if (there) {
            pushData(items, item.id, item.name)
          }
          return find(item.productsInCategory, findId, findName)
        }
      }
    })
  }
  find(arr, id, name)
  return items
}

const entryMenu = [{ id: 0, name: `Главная` }]

export const $menu = createStore(entryMenu)

export const whatMenuIsIt = (menu, lastItem) => menu[menu.length - 1].name === lastItem

$menu
  .on(eventsForStore.addMenuItem, (state, menuItem) => [...state, menuItem])
  .on(eventsForStore.removeMenuItemsTo, (state, data) => {
    const indexMenuItem = state.findIndex(item => item.id === data.id)
    return state.slice(0, indexMenuItem + 1)
  })
  .on(eventsForStore.createMenuPath, (_, data) =>
    [...entryMenu].concat(menuPath($productList.defaultState, data.id, data.name)),
  )
  .on(eventsForStore.createSearchMenu, state => {
    return !whatMenuIsIt(state, `Поиск`) ? state.concat({ name: `Поиск` }) : state
  })
  .on(eventsForStore.createCartMenu, () => [...entryMenu].concat({ name: `Корзина` }))
  .on(eventsForStore.deleteLastMenuItem, state => state.splice(0, state.length - 1))
