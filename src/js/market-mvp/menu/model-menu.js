import { createEvent, createStore } from 'effector'
import { menuPath } from '../utils/filter'
import { productListData } from '../products/model-products'

const entryMenu = [{ id: 0, name: 'Главная' }]

export const isSearchMenu = (menu) => menu[menu.length - 1].name === 'Поиск'

export const $menu = createStore(entryMenu)

export const addMenuItem = createEvent()
export const removeMenuItemsTo = createEvent()
export const createMenuPath = createEvent()
export const createCartMenu = createEvent()
export const createSearchMenu = createEvent()
export const deleteLastMenuItem = createEvent()

$menu
  .on(addMenuItem, (state, menuItem) => [...state, menuItem])
  .on(removeMenuItemsTo, (state, data) => {
    const indexMenuItem = state.findIndex((item) => item.id === data.id)
    return state.slice(0, indexMenuItem + 1)
  })
  .on(createMenuPath, (_, data) =>
    [...entryMenu].concat(menuPath(productListData, data.id, data.name))
  )
  .on(createSearchMenu, (state) =>
    !isSearchMenu(state) ? state.concat({ name: 'Поиск' }) : state
  )
  .on(createCartMenu, () => [...entryMenu].concat({ name: 'Корзина' }))
  .on(deleteLastMenuItem, (state) => state.splice(0, state.length - 1))
