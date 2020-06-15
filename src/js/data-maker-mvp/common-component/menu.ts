import AbstractComponent from '../utils/abstarct-component'

const menuTemplate = `<div class="data-maker__left"></div>`

export default class MenuComponent extends AbstractComponent {
  public getTemplate(): string {
    return menuTemplate
  }
}
