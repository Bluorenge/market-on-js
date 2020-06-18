import AbstractComponent from '../../utils/abstarct-component'

const getOptionListTemplate = (id, state) => {
  const valueNameOptionList = state ? `value="${state.nameOptionList}"` : ``
  const optionList = state
    ? state.optionList
        .map((item, index) => createOption(id, index + 1, Object.entries(item)))
        .join(``)
    : createOption(id, 1)

  return `
    <div class="data-maker__option-wrap">
      <label class="data-maker__field-wrap">
        <div class="data-maker__fields-top">
          <h3 class="data-maker__name-field">Название группы опций</h3>
          <div class="data-maker__delete-btn data-maker__delete-btn--option"></div>
        </div>
        <input class="data-maker__input data-maker__input--option-list-name" type="text" name="option-title-product-id-${id}" placeholder="Название опции" required ${valueNameOptionList}>
      </label>
      <div class="data-maker__option">${optionList}</div>
      <div class="data-maker__add data-maker__add--option-item" tabindex="0">+ Добавить опцию</div>
    </div>
  `
}

export default class DescComponent extends AbstractComponent {
  getTemplate() {
    return getOptionListTemplate()
  }

  setRemoveOptionsHandler(handler) {
    this.getElement()
      .querySelector(`.data-maker__delete-btn--desc`)
      .addEventListener(`click`, handler)
  }
}
