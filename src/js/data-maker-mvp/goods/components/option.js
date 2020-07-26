import AbstractComponent from '../../utils/abstarct-component'
import { debounce } from '../../utils/utils'

const getOptionTamplate = (numberOption, state) => {
  const valueOption = state ? `value="${state.name}"` : ``
  const price = state ? `value="${state.price}"` : ``
  const checkActiveState = state?.active ? 'checked' : ``
  const isActive = state ? checkActiveState : 'checked'

  return `<li class="data-maker__option-item">
    <label class="data-maker__option-field-wrap">
      <div class="data-maker__fields-top">
        <h4 class="data-maker__name-field">Опция <span class="data-maker__option-num">${numberOption}</span></h4>
        <div class="data-maker__delete-btn data-maker__delete-btn--option"></div>
      </div>
      <input class="data-maker__input data-maker__input--option-name" type="text" name="option-${numberOption}" placeholder="Например: M" ${valueOption} required>
      <div class="data-maker__input-error-message visually-hidden">Такое имя уже есть</div>
    </label>
    <label class="data-maker__option-field-wrap">
      <span class="data-maker__name-field">Цена</span>
      <input class="data-maker__input data-maker__input--option-price" type="number" placeholder="Введите цену товара" min="1" ${price} required>
    </label>
    <label class="data-maker__option-field-wrap">
      <input class="data-maker__input data-maker__input--option-active" type="checkbox" ${isActive}>
      <span>Сделать активной</span>
    </label>
  </li>`
}

export default class OptionComponent extends AbstractComponent {
  constructor(index, data, isSingleOption = false) {
    super()

    this.index = index
    this.data = data
  }

  getTemplate() {
    return getOptionTamplate(this.index, this.data)
  }

  getIndex() {
    return this.index
  }

  getNameInput() {
    return this.getElement().querySelector(`.data-maker__input--option-name`)
  }

  addErrorClass() {
    this.getElement()
      .querySelector(`.data-maker__input--option-name`)
      .classList.add('data-maker__input--error')
    this.getElement()
      .querySelector(`.data-maker__input-error-message`)
      .classList.remove('visually-hidden')
  }

  removeErrorClass() {
    this.getElement()
      .querySelector(`.data-maker__input--option-name`)
      .classList.remove('data-maker__input--error')
    this.getElement()
      .querySelector(`.data-maker__input-error-message`)
      .classList.add('visually-hidden')
  }

  setInputHandler(handler) {
    this.getElement().querySelector(`.data-maker__input--option-name`).oninput = debounce(
      handler,
      300,
    )
    this.getElement().querySelector(`.data-maker__input--option-price`).onchange = debounce(
      handler,
      300,
    )
    this.getElement().querySelector(`.data-maker__input--option-active`).onchange = debounce(
      handler,
      300,
    )
  }

  setRemoveOptionBtn() {
    this.getElement()
      .querySelector(`.data-maker__delete-btn--option`)
      .classList.add(`visually-hidden`)
  }

  setRemoveOptionBtnHandler(handler) {
    this.getElement()
      .querySelector(`.data-maker__delete-btn--option`)
      .addEventListener(`click`, handler)
  }

  getOptionData() {
    const name = this.getElement().querySelector('.data-maker__input--option-name').value.toString()
    const price = this.getElement().querySelector('.data-maker__input--option-price').value
    const active = this.getElement().querySelector('.data-maker__input--option-active').checked

    return {
      name,
      price,
      active,
    }
  }
}
