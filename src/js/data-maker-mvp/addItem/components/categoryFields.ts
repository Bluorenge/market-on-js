import AbstractComponent from '../../utils/abstarct-component'

interface IDataCategory {
  name: string
  img: string
}

const addCategoryTemplate = (
  id: number,
  typeOfCategory: string,
  data?: IDataCategory
): string => {
  return `<fieldset id="${id}" class="data-maker__fields data-maker__fields--category">
      <div class="data-maker__fields-top">
        <h2 class="data-maker__fields-title">
        ${
          data
            ? `${data.name}`
            : `Добавление <span class="data-maker__fields-title-type">${typeOfCategory}</span>`
        }
        </h2>
        <div class="data-maker__hide-btn">Скрыть</div>
        <div class="data-maker__delete-btn data-maker__delete-btn--fields"></div>
      </div>
      <div class="data-maker__fields-content">
        <label class="data-maker__field-wrap">
          <h3 class="data-maker__name-field">Название ${typeOfCategory} *</h3>
          <input class="data-maker__input data-maker__input--name" type="text" name="category-id-${id}" placeholder="Название ${typeOfCategory}" 
          ${data ? `value="${data.name}"` : ``} required>
        </label>
        <label class="data-maker__field-wrap">
          <h3 class="data-maker__name-field data-maker__name-field--new-line">
            Картинка ${typeOfCategory} <span>(название картинки из редактора)</span>
          </h3>
          <input class="data-maker__input data-maker__input--img" type="text" name="img-category-id-${id}" placeholder="Название картинки" 
          ${data ? `value="${data.img}"` : ``}>
        </label>
      </div>
      <div class="data-maker__add data-maker__add--product" tabindex="0">
        + Добавить товар
      </div>
      <div class="data-maker__add data-maker__add--subcategory" tabindex="0">
        + Добавить подкатегорию
      </div>
    </fieldset>`
}

export default class AddCategoryComponent extends AbstractComponent {
  public getTemplate(): string {
    return addCategoryTemplate(1, `Подкатегории`)
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
