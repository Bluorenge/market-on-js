import AbstractComponent from '../../utils/abstarct-component'

const getProductTemplate = data => {
  const isActive = data?.active ? `checked` : ``
  const isChecked = data ? isActive : `checked`
  const name = data ? data.name : `Добавление товара`
  const valueName = data ? data.name : ``
  const img = data?.img ? data.img : ``
  const price = data ? data.price : ``

  return `<form class="data-maker__fields data-maker__fields--product">
    <div class="data-maker__fields-top">
      <h2 class="data-maker__fields-title">${name}</h2>
      <div class="data-maker__hide-btn">Скрыть</div>
      <div class="data-maker__delete-btn data-maker__delete-btn--fields"></div>   
    </div>
    <div class="data-maker__fields-content">
      <div class="data-maker__field-wrap">
        <h3 class="data-maker__name-field">Название товара *</h3>
        <input class="data-maker__input data-maker__input--name" type="text" name="name-product" placeholder="Название товара" value="${valueName}" required>
        <span>В наличии:</span>
        <input class="data-maker__input data-maker__input--product-active" type="checkbox"
        ${isChecked}>
      </div>
      <label class="data-maker__field-wrap">
        <h3 class="data-maker__name-field data-maker__name-field--new-line">Название картинки <span>(название файла из редактора)</span></h3>
        <input class="data-maker__input data-maker__input--img" type="text" name="img-product" placeholder="Название картинки" value="${img}">
      </label>
      <label class="data-maker__field-wrap">
        <h3 class="data-maker__name-field">Цена товара *</h3>
        <input class="data-maker__input data-maker__input--price-product" type="number" name="price-product" placeholder="Цена товара" value="${price}" required>
      </label>
    </div>
    <div class="data-maker__add data-maker__add--desc" tabindex="0">
      + Добавить описание
    </div>
    <div class="data-maker__add data-maker__add--option-wrap" tabindex="0">
      + Добавить товару опцию
    </div>
    <button class="data-maker__btn" style="display: none"></button>
  </form>`
}

export default class ProductComponent extends AbstractComponent {
  constructor(data) {
    console.log('data :', data)
    super()

    this.data = data
  }

  getTemplate() {
    return getProductTemplate(this.data)
  }

  getData() {
    const name = this.getElement().querySelector(`.data-maker__input--name`).value
    const img = this.getElement().querySelector(`.data-maker__input--img`).value
    const price = this.getElement().querySelector(`.data-maker__input--price-product`).value
    const active = this.getElement().querySelector(`.data-maker__input--product-active`).checked

    return {
      name,
      img: img !== `` ? img : undefined,
      price,
      active,
    }
  }

  setAddDescHandler(handler) {
    this.getElement().querySelector(`.data-maker__add--desc`).addEventListener(`click`, handler)
  }

  setAddOptionsHandler(handler) {
    this.getElement()
      .querySelector(`.data-maker__add--option-wrap`)
      .addEventListener(`click`, handler)
  }

  clickBtn() {
    this.getElement().querySelector('.data-maker__btn').click()
  }
}
