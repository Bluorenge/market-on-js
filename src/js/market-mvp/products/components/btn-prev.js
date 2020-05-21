import AbstractComponent from '../../utils/abstract-component'

const btnPrevTemplate = `<button class="market-btn--prev-step">← Назад</button>`

export default class BtnPrevComponent extends AbstractComponent {
  getTemplate() {
    return btnPrevTemplate
  }

  setPrevBtnHandler(handler) {
    this.getElement().addEventListener(`click`, handler)
  }
}
