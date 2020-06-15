import AbstractComponent from '../../utils/abstarct-component'

const addItemTemplate = `<div class="data-maker__entry-point">
  <div class="data-maker__add data-maker__add--product" tabindex="0">
    + Добавить товар
  </div>
  <div class="data-maker__add data-maker__add--category" tabindex="0">
    + Добавить категорию
  </div>
</div>`

export default class AddItemsComponent extends AbstractComponent {
  public getTemplate(): string {
    return addItemTemplate
  }

  public setAddCategoryHandler(handler: () => void): void {
    this.getElement()
      .querySelector(`.data-maker__add--category`)
      .addEventListener(`click`, handler)
  }

  public setAddProductHandler(handler: () => void): void {
    this.getElement()
      .querySelector(`.data-maker__add--product`)
      .addEventListener(`click`, handler)
  }
}
