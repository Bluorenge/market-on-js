import { createElement } from './render'

const HIDDEN_CLASS = `visually-hidden`

export interface IAbstractComponent {
  getElement(): HTMLElement
  removeElement(): void
  show(): void
  hide(): void
  getTemplate(): string
}

export default abstract class AbstractComponent implements IAbstractComponent {
  protected element: HTMLElement

  constructor() {
    this.element = null
  }

  public getElement(): HTMLElement {
    if (!this.element) {
      this.element = createElement(this.getTemplate())
    }

    return this.element
  }

  public removeElement(): void {
    this.element = null
  }

  public show(): void {
    if (this.element) {
      this.element.classList.remove(HIDDEN_CLASS)
    }
  }

  public hide(): void {
    if (this.element) {
      this.element.classList.add(HIDDEN_CLASS)
    }
  }

  abstract getTemplate(): string
}
