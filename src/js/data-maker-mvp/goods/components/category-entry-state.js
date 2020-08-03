import AbstractComponent from '../../utils/abstarct-component'

const addDescBtn = `<div class="data-maker__tabs">
  <button class="data-maker__btn-add data-maker__btn-add--product-category">Добавить товар</button>
  <button class="data-maker__btn-add data-maker__btn-add--subcategory">Добавить подкатегорию</button>
</div>`

export default class CategoryEntryStateComponent extends AbstractComponent {
  getTemplate() {
    return addDescBtn
  }

  setAddProductBtnHandler(handler) {
    this.getElement
      .querySelector('.data-maker__btn-add--product-category')
      .addEventListener('click', handler)
  }

  setAddSubCategoryBtnHandler(handler) {
    this.getElement
      .querySelector('.data-maker__btn-add--subcategory')
      .addEventListener('click', handler)
  }
}
