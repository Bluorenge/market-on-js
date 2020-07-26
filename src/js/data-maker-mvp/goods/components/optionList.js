import AbstractComponent from '../../utils/abstarct-component'
import elementReady from 'element-ready'
import { debounce } from '../../utils/utils'

const getOptionListTemplate = state => {
  const valueNameOptionList = state?.options ? `value="${state.options.nameOptionList}"` : ``

  return `<div class="data-maker__option-wrap">
    <label class="data-maker__field-wrap">
      <div class="data-maker__fields-top">
        <h3 class="data-maker__name-field">Название группы опций</h3>
        <div class="data-maker__delete-btn data-maker__delete-btn--option"></div>
      </div>
      <input class="data-maker__input data-maker__input--option-list-name" type="text" name="option-title-product" placeholder="Название опции" required ${valueNameOptionList}>
    </label>
    <ul class="data-maker__option"></ul>
    <div class="data-maker__add data-maker__add--option-item" tabindex="0">+ Добавить опцию</div>
  </div>`
}

export default class OptionListComponent extends AbstractComponent {
  constructor(data) {
    console.log('data :', data)
    super()

    this.data = data
  }

  getTemplate() {
    return getOptionListTemplate(this.data)
  }

  getOptionList() {
    return this.getElement().querySelector(`.data-maker__option`)
  }

  setAddOptionBtnHandler(handler) {
    this.getElement()
      .querySelector(`.data-maker__add--option-item`)
      .addEventListener(`click`, handler)
  }

  setRemoveOptionsHandler(handler) {
    this.getElement()
      .querySelector(`.data-maker__delete-btn--option`)
      .addEventListener(`click`, handler)
  }

  setInputHandler(handler) {
    this.getElement().querySelector(`.data-maker__input--option-list-name`).oninput = debounce(
      handler,
      300,
    )
  }

  getOptionListName() {
    // ;(async () => {
    //   const el = await elementReady('.data-maker__input--option-list-name')
    //   console.log('el :', el)

    //   return { nameOptionList: el.value }
    // })()
    const nameOptionList = this.getElement().querySelector(`.data-maker__input--option-list-name`)
      .value

    return { nameOptionList }
  }
}
