import { RenderPosition, render, remove } from '../../utils/render'

import CategoryComponent from '../components/category'
import { $idContent, $isFormValidate, $productList, findCategory } from '../../models/model'
import { eventsForDataMaker } from '../../models/eventsForDataMaker'

import * as findAnd from 'find-and'

export default class CategoryController {
  constructor(container) {
    this.container = container

    this._categoryComponent = null
  }

  render() {
    this._categoryComponent = new CategoryComponent(findCategory.getState())
    render(this.container, this._categoryComponent, RenderPosition.BEFOREEND)
  }

  remove() {
    remove(this._categoryComponent)
  }

  isValidity() {
    if (!this._categoryComponent.getElement().checkValidity()) {
      eventsForDataMaker.toggleValidate(false)
      this._categoryComponent.clickBtn()
    } else {
      const id = Number(this.container.id.replace(/[^+\d]/g, ``))
      eventsForDataMaker.makeCategory({ id, item: this._categoryComponent.getData() })

      if (!$isFormValidate.getState()) {
        eventsForDataMaker.toggleValidate(true)
      }
    }

    return this._categoryComponent.getElement().checkValidity()
  }
}
