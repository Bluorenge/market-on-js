import AbstractComponent from '../../utils/abstarct-component'

const globalSettingTemplate = `<div class="data-maker__global-setting">
  <label>
    <h3 class="data-maker__name-field">ID пользователя</h3>
    <input class="data-maker__input data-maker__input--user-id" type="text" name="user-id" placeholder="ID пользователя" required />
  </label>
  <label>
    <h3 class="data-maker__name-field">Валюта магазина</h3>
    <input class="data-maker__input data-maker__input--currency" type="text" name="currency" placeholder="Например: руб." required />
  </label>
</div>`

export default class GlobalSettingComponent extends AbstractComponent {
  public getTemplate(): string {
    return globalSettingTemplate
  }
}
