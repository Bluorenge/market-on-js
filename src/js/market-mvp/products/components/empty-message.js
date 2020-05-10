import AbstractComponent from '../../utils/abstract-component'

const btnPrevTemplate = `<div class="market-content--fade-in market-content__empty">Ничего не найдено</div>`

export default class EmptyMessageComponent extends AbstractComponent {
  getTemplate() {
    return btnPrevTemplate
  }

  setPrevBtnHandler(handler) {
    this.getElement().addEventListener(`click`, handler)
  }
}
