import AbstractComponent from '../../utils/abstarct-component'

const menuListTemplate = `<ul class="data-maker__menu">
  <li class="data-maker__menu-item">
    <button class="data-maker__setting-btn">Глобальные настройки</button>
  </li>
</ul>`

export default class MenuListComponent extends AbstractComponent {
  public getTemplate(): string {
    return menuListTemplate
  }

  public setSettingHandler(handler: () => void): void {
    this.getElement()
      .querySelector(`.data-maker__setting-btn`)
      .addEventListener(`click`, handler)
  }
}
