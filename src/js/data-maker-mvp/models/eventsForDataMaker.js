import { createEvent } from 'effector'

export const eventsForDataMaker = {
  idContentIncrease: createEvent(),
  toggleValidate: createEvent(),
  validateFrom: createEvent(),
  changeView: createEvent(),
  searchItem: createEvent(),

  updateSetting: createEvent(),

  makeCategory: createEvent(),

  makeProduct: createEvent(),
  deleteProduct: createEvent(),

  makeDesc: createEvent(),
  deleteDesc: createEvent(),
}
