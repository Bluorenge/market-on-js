import AbstractComponent from '../../utils/abstarct-component'

const menuAddCategoryTemplate = `<div class="data-maker__btn-add-wrap">
  <button class="data-maker__btn data-maker__btn--add-category">Добавить категорию</button>
  <button class="data-maker__btn data-maker__btn--add-product">Добавить товар</button>
</div>`

export default class MenuAddItemsBtnComponent extends AbstractComponent {
  getTemplate() {
    return menuAddCategoryTemplate
  }

  setAddCategoryHandler(handler) {
    this.getElement()
      .querySelector(`.data-maker__btn--add-category`)
      .addEventListener(`click`, handler)
  }

  setAddProductHandler(handler) {
    this.getElement()
      .querySelector(`.data-maker__btn--add-product`)
      .addEventListener(`click`, handler)
  }
}
