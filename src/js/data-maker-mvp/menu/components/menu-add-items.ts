import AbstractComponent from '../../utils/abstarct-component'

const menuAddCategoryTemplate = `<div class="data-maker__btn-add-wrap">
  <button class="data-maker__btn data-maker__btn--add-category">Добавить категорию</button>
  <button class="data-maker__btn data-maker__btn--add-product">Добавить товар</button>
</div>`

export default class MenuAddItemsBtnComponent extends AbstractComponent {
  public getTemplate(): string {
    return menuAddCategoryTemplate
  }

  public setAddCategoryHandler(handler: () => void): void {
    this.getElement()
      .querySelector(`.data-maker__btn--add-category`)
      .addEventListener(`click`, handler)
  }

  public setAddProductHandler(handler: () => void): void {
    this.getElement()
      .querySelector(`.data-maker__btn--add-product`)
      .addEventListener(`click`, handler)
  }
}
