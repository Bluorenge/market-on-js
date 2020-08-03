import { createEvent } from 'effector'

export const eventsForDataMaker = {
  setCurrentIdValue: createEvent(),

  idContentIncrease: createEvent(),

  toggleValidate: createEvent(),
  validateFrom: createEvent(),

  changeView: createEvent(),

  searchItem: createEvent(),

  changeMenuItemName: createEvent(),
  deleteMenuItem: createEvent(),

  updateSetting: createEvent(),

  makeCategory: createEvent(),
  deleteCategory: createEvent(),
  makeSubCategory: createEvent(),

  makeProduct: createEvent(),
  deleteProduct: createEvent(),
  updateProduct: createEvent(),

  makeDesc: createEvent(),
  deleteDesc: createEvent(),

  makeOptions: createEvent(),
  deleteOptions: createEvent(),
  deleteOption: createEvent(),

  changeViewTab: createEvent(),
}
