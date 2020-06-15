import AbstractComponent from '../../utils/abstarct-component'

const generateListBtn = `<div class="data-maker__right"></div>`

export default class ContentComponent extends AbstractComponent {
  public getTemplate(): string {
    return generateListBtn
  }
}
