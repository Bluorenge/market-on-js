import { createEvent } from 'effector'

export const eventsForStore = {
  changeProductListState: createEvent('Open product-list-item'),
  findProductsInDefaultProductList: createEvent(
    'For open product into cart and open list from menu'
  ),
  closeCartPage: createEvent(),
  toMainPage: createEvent(),

  openProductPage: createEvent(),
  closeProductPage: createEvent(),

  search: createEvent(),
  productListToCurrentView: createEvent('When input clear'),
  clearSearchInput: createEvent(),
  disabledSearch: createEvent(),
  enabledSearch: createEvent(),

  addMenuItem: createEvent(),
  removeMenuItemsTo: createEvent(),
  createMenuPath: createEvent(),
  createCartMenu: createEvent(),
  createSearchMenu: createEvent(),
  deleteLastMenuItem: createEvent(),

  openCartPage: createEvent(),
  addToCart: createEvent(),
  updateQuantityOfProductInCart: createEvent(),
  deleteProductInCart: createEvent(),
  sendOrder: createEvent(),
  toMainPageFromCart: createEvent(),
  oneClickOrder: createEvent(),
}

eventsForStore.toMainPageFromCart.watch(() => {
  eventsForStore.removeMenuItemsTo({ id: 0 })
  eventsForStore.toMainPage()
  eventsForStore.closeCartPage()
})
