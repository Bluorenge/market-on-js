import { createEvent } from 'effector'

export const eventsForStore = {
  openListItem: createEvent(),
  changeProductListState: createEvent(),
  findProductsInDefaultProductList: createEvent(),
  closeCartPage: createEvent(),
  toDefaultState: createEvent(),

  openProductPage: createEvent(),

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
  sendOrder: createEvent()
}