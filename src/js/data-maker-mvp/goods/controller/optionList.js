import { RenderPosition, render, remove } from '../../utils/render'

import CategoryComponent from '../components/category'

export default class OptionListController {
  constructor(container) {
    this.container = container

    this._optionListComponent = null
    this._optionItems = null
  }

  render() {
    this._optionListComponent = new CategoryComponent()
    render(this.container, this._optionListComponent, RenderPosition.BEFOREEND)
  }

  remove() {
    remove(this._optionListComponent)
  }
}
