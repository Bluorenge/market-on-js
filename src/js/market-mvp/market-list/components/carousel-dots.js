import AbstractComponent from '../../utils/abstract-component'

const carouselDotsTemplate = `<div role="tablist" class="dots"></div>`

export default class CarouselDotsComponent extends AbstractComponent {
  getTemplate() {
    return carouselDotsTemplate
  }

  setPrevBtnHandler(handler) {
    this.getElement().addEventListener(`click`, handler)
  }
}
