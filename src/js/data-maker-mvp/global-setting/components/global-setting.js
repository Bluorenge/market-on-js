import AbstractComponent from '../../utils/abstarct-component'

const globalSettingTemplate = data => {
  const id = data ? data.id : 'sdf'
  const currency = data ? data.currency : 'sdf'

  return `<form class="data-maker__global-setting">
  <label>
    <h3 class="data-maker__name-field">ID пользователя</h3>
    <input class="data-maker__input data-maker__input--user-id" type="text" name="user-id" placeholder="ID пользователя" value="${id}" required />
  </label>
  <label>
    <h3 class="data-maker__name-field">Валюта магазина</h3>
    <input class="data-maker__input data-maker__input--currency" type="text" name="currency" placeholder="Например: руб." value="${currency}" required />
  </label>
  <button class="data-maker__btn" style="display: none"></button>
</form>`
}

export default class GlobalSettingComponent extends AbstractComponent {
  constructor(data) {
    super()

    this.data = data
  }

  getTemplate() {
    return globalSettingTemplate(this.data)
  }

  getData() {
    const id = this.getElement().querySelector('.data-maker__input--user-id').value
    const currency = this.getElement().querySelector('.data-maker__input--currency').value
    return { id, currency }
  }

  clickBtn() {
    this.getElement().querySelector('.data-maker__btn').click()
  }
}
