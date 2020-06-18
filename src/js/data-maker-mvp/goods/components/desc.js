import AbstractComponent from '../../utils/abstarct-component'
import { debounce } from '../../utils/utils'

const getDescTamplate = text => {
  const isText = text ? text : ``

  return `<label class="data-maker__field-wrap data-maker__field-wrap--desc">
      <div class="data-maker__fields-top">
        <h3 class="data-maker__name-field">Описание товара:</h3>
        <div class="data-maker__delete-btn data-maker__delete-btn--desc"></div>
      </div>  
      <textarea class="data-maker__input data-maker__input--desc-product" name="desc-product" placeholder="Поддерживает перенос строк">${isText}</textarea>
    </label>`
}

export default class DescComponent extends AbstractComponent {
  constructor(data) {
    console.log('data :', data)
    super()

    this.data = data
  }

  getTemplate() {
    return getDescTamplate(this.data)
  }

  getInputValue() {
    return this.getElement().querySelector(`.data-maker__input--desc-product`).value
  }

  setInputHandler(handler) {
    this.getElement().querySelector(`.data-maker__input--desc-product`).oninput = debounce(
      handler,
      300,
    )
  }

  setRemoveDescHandler(handler) {
    this.getElement()
      .querySelector(`.data-maker__delete-btn--desc`)
      .addEventListener(`click`, handler)
  }
}
