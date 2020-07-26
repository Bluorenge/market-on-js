import AbstractComponent from '../../utils/abstarct-component'

const menuSettingItemTemplate = `<li class="data-maker__menu-item" id="menu-item-0">
  <button class="data-maker__item-btn data-maker__setting-btn">Глобальные настройки</button>
</li>`

export default class MenuSettingItemComponent extends AbstractComponent {
  getTemplate() {
    return menuSettingItemTemplate
  }

  getIndex() {
    return 0
  }

  setOpenItemHandler(handler) {
    this.getElement().querySelector(`.data-maker__item-btn`).addEventListener(`click`, handler)
  }

  setDisabledBtn() {
    this.getElement().querySelector(`.data-maker__item-btn`).disabled = true
  }

  setEnabledBtn() {
    this.getElement().querySelector(`.data-maker__item-btn`).disabled = false
  }
}
