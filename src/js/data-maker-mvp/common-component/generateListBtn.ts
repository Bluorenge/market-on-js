import AbstractComponent from '../utils/abstarct-component'

const generateListBtn = `<input class="data-maker__btn" type="submit" name="submit-btn" value="Сгенерировать список товаров" />`

export default class GenerateListBtnComponent extends AbstractComponent {
  public getTemplate(): string {
    return generateListBtn
  }
}
