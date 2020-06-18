import AbstractComponent from '../../utils/abstarct-component'

const categoryTemplate = (typeOfCategory, data) => {
  let nameCategory = `Добавление <span class="data-maker__fields-title-type">${typeOfCategory}</span>`
  let nameValue = ``
  let imgValue = ``

  if (data) {
    nameCategory = data.name
    nameValue = data.name
    imgValue = data.img ? data.img : ``
  }

  return `<form class="data-maker__fields data-maker__fields--category">
      <div class="data-maker__fields-top">
        <h2 class="data-maker__fields-title">
        ${nameCategory}
        </h2>
        <div class="data-maker__hide-btn">Скрыть</div>
        <div class="data-maker__delete-btn data-maker__delete-btn--fields"></div>
      </div>
      <div class="data-maker__fields-content">
        <label class="data-maker__field-wrap">
          <h3 class="data-maker__name-field">Название ${typeOfCategory} *</h3>
          <input class="data-maker__input data-maker__input--name" type="text" name="category" placeholder="Название ${typeOfCategory}" 
          value="${nameValue}" required>
        </label>
        <label class="data-maker__field-wrap">
          <h3 class="data-maker__name-field data-maker__name-field--new-line">
            Картинка ${typeOfCategory} <span>(название картинки из редактора)</span>
          </h3>
          <input class="data-maker__input data-maker__input--img" type="text" name="img-category" placeholder="Название картинки" 
          value="${imgValue}">
        </label>
      </div>
      <div class="data-maker__add data-maker__add--product" tabindex="0">
        + Добавить товар
      </div>
      <div class="data-maker__add data-maker__add--subcategory" tabindex="0">
        + Добавить подкатегорию
      </div>
      <button class="data-maker__btn" style="display: none"></button>
    </form>`
}

export default class CategoryComponent extends AbstractComponent {
  constructor(data) {
    console.log('data :', data)
    super()

    this.data = data
  }

  getTemplate() {
    return categoryTemplate(`Подкатегории`, this.data)
  }

  setAddCategoryHandler(handler) {
    this.getElement().querySelector(`.data-maker__add--category`).addEventListener(`click`, handler)
  }

  setAddProductHandler(handler) {
    this.getElement().querySelector(`.data-maker__add--product`).addEventListener(`click`, handler)
  }

  getData() {
    const name = this.getElement().querySelector(`.data-maker__input--name`).value
    const img = this.getElement().querySelector(`.data-maker__input--img`).value

    return {
      name,
      img: img !== `` ? img : undefined,
    }
  }

  clickBtn() {
    this.getElement().querySelector('.data-maker__btn').click()
  }
}
