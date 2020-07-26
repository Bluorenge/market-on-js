import AbstractComponent from '../../utils/abstarct-component'

const getProductTemplate = (data, id) => {
  const wrapTag = id ? 'div' : 'form'
  const productId = id ? `id="${id}"` : ''

  const isActive = data?.active ? `checked` : ``
  const isChecked = data ? isActive : `checked`
  const name = data ? data.name : `Добавление товара`
  const valueName = data ? data.name : ``
  const img = data?.img ? data.img : ``
  const price = data ? data.price : ``

  return `<${wrapTag} class="data-maker__fields data-maker__fields--product" ${productId}>
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
    <button class="data-maker__btn" style="display: none"></button>
  </${wrapTag}>`
}

export default class ProductComponent extends AbstractComponent {
  constructor(data, id) {
    console.log('data :', data)
    super()

    this.data = data
    this.id = id
  }

  getTemplate() {
    return getProductTemplate(this.data, this.id)
  }

  setRemoveProductBtnHandler(handler) {
    this.getElement().querySelector('.data-maker__delete-btn').addEventListener(`click`, handler)
  }

  setInputsHandler(handler) {
    this.getElement().querySelector('.data-maker__input--name').onchange = handler
    this.getElement().querySelector(`.data-maker__input--img`).onchange = handler
    this.getElement().querySelector(`.data-maker__input--price-product`).onchange = handler
    this.getElement().querySelector(`.data-maker__input--product-active`).onchange = handler
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

  clickBtn() {
    this.getElement().querySelector('.data-maker__btn').click()
  }
}
