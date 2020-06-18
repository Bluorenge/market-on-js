import AbstractComponent from '../../utils/abstarct-component'

const getOptionTamplate = (id, numberOption, state) => {
  const number = state ? state : numberOption
  const valueOption = state ? `value="${state.map(([key]) => key)[0]}"` : ``
  const price = state ? `value="${state.map(([, value]) => value)[1]}"` : ``
  const options = state ? (state.map(([, value]) => value)[0] ? `checked` : ``) : `checked`

  return `
    <div class="data-maker__option-item">
      <label class="data-maker__option-field-wrap">
        <h4 class="data-maker__name-field">Опция <span class="data-maker__option-num">${numberOption}</span></h4>
        <input class="data-maker__input data-maker__input--option-name data-maker__input--option-${number}-product" type="text" name="option-${numberOption}-product-id-${id}" placeholder="Например: M" ${valueOption} required>
      </label>
      <label class="data-maker__option-field-wrap">
        <span class="data-maker__name-field">Цена</span>
        <input class="data-maker__input data-maker__input--option-price" type="number" placeholder="Введите цену товара" ${price} required>
      </label>
      <label class="data-maker__option-field-wrap">
        <input class="data-maker__input data-maker__input--option-active" type="checkbox" ${options}>
        <span>Сделать активной</span>
      </label>
    </div>
  `
}

export default class DescComponent extends AbstractComponent {
  getTemplate() {
    return getOptionTamplate()
  }
}
