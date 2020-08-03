import AbstractComponent from '../../utils/abstarct-component'

const categoryTemplate = (typeOfCategory, id, data) => {
  const wrapTag = typeOfCategory === 'категории' ? 'form' : 'div'
  const categoryId = id ? `id="${id}"` : ''
  const addProductBtn =
    typeOfCategory === 'категории'
      ? '<div class="data-maker__add data-maker__add--product" tabindex="0">+ Добавить товар</div>'
      : ''

  let nameCategory = `Добавление <span class="data-maker__fields-title-type">${typeOfCategory}</span>`
  let nameValue = ``
  let imgValue = ``

  if (data) {
    nameCategory = data.name
    nameValue = data.name
    imgValue = data.img ? data.img : ``
  }

  return `<${wrapTag} ${categoryId}>
    <div class="data-maker__fields data-maker__fields--category">
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
      ${addProductBtn}
      <div class="data-maker__add data-maker__add--subcategory" tabindex="0">
        + Добавить подкатегорию
      </div>
      <button class="data-maker__btn" style="display: none"></button>
    </div>
  </${wrapTag}>`
}

export default class CategoryComponent extends AbstractComponent {
  constructor(type, id, data) {
    super()

    this.type = type
    this.id = id
    this.data = data
  }

  getIndex() {
    return this.id
  }

  getTemplate() {
    return categoryTemplate(this.type, this.id, this.data)
  }

  hideBtn(btn) {
    switch (btn) {
      case 'category':
        this.getElement().querySelector(`.data-maker__add--subcategory`).style = 'display: none;'
        break
      case 'product':
        this.getElement().querySelector(`.data-maker__add--product`).style = 'display: none;'
    }
  }

  showBtn() {
    this.getElement().querySelector(`.data-maker__add--subcategory`).style = 'display: block;'
    this.getElement().querySelector(`.data-maker__add--product`).style = 'display: block;'
  }

  setInputsHandler(handler) {
    this.getElement().querySelector('.data-maker__input--name').onchange = handler
    this.getElement().querySelector(`.data-maker__input--img`).onchange = handler
  }

  setRemoveCategoryBtnHandler(handler) {
    this.getElement().querySelector('.data-maker__delete-btn').addEventListener(`click`, handler)
  }

  setAddCategoryHandler(handler) {
    this.getElement()
      .querySelector(`.data-maker__add--subcategory`)
      .addEventListener(`click`, handler)
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
