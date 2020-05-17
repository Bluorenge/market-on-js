import { createStore } from 'effector'
import { menuPath } from '../utils/filter'
import { eventsForStore } from '../main/eventsForStore'
import { $productList } from '../products/model-products'

const entryMenu = [{ id: 0, name: 'Главная' }]

export const $menu = createStore(entryMenu)

export const isSearchMenu = (menu) => menu[menu.length - 1].name === 'Поиск'

$menu
  .on(eventsForStore.addMenuItem, (state, menuItem) => [...state, menuItem])
  .on(eventsForStore.removeMenuItemsTo, (state, data) => {
    const indexMenuItem = state.findIndex((item) => item.id === data.id)
    return state.slice(0, indexMenuItem + 1)
  })
  .on(eventsForStore.createMenuPath, (_, data) =>
    [...entryMenu].concat(menuPath($productList, data.id, data.name))
  )
  .on(eventsForStore.createSearchMenu, (state) =>
    !isSearchMenu(state) ? state.concat({ name: 'Поиск' }) : state
  )
  .on(eventsForStore.createCartMenu, () =>
    [...entryMenu].concat({ name: 'Корзина' })
  )
  .on(eventsForStore.deleteLastMenuItem, (state) =>
    state.splice(0, state.length - 1)
  )
