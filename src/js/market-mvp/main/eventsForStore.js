import { createEvent } from 'effector'

export const eventsForStore = {
  openCartPage: createEvent(),
  changeProductListState: createEvent(),
  findProductsInDefaultProductList: createEvent(),
  closeCartPage: createEvent(),
  toDefaultState: createEvent(),
  search: createEvent(),
  searchByDefault: createEvent(),

  addMenuItem: createEvent(),
  removeMenuItemsTo: createEvent(),
  createMenuPath: createEvent(),
  createCartMenu: createEvent(),
  createSearchMenu: createEvent(),
  deleteLastMenuItem: createEvent(),

  addToCart: createEvent(),
  updateQuantityOfProductInCart: createEvent(),
  deleteProductInCart: createEvent(),
}