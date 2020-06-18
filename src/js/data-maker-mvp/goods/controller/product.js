import { RenderPosition, render, remove } from '../../utils/render'
import ProductComponent from '../components/product'
import DescComponent from '../components/desc'
import OptionListController from './optionList'
import { eventsForDataMaker } from '../../models/eventsForDataMaker'
import { $isFormValidate, findCategory } from '../../models/model'

export default class ProductController {
  constructor(container) {
    this.container = container

    this._id = Number(this.container.id.replace(/[^+\d]/g, ``))

    this._productComponent = null
    this._descComponent = null
    this._optionListController = null
  }

  render() {
    this._productComponent = new ProductComponent(findCategory.getState())
    render(this.container, this._productComponent, RenderPosition.BEFOREEND)
    eventsForDataMaker.makeProduct({ id: this._id })
    this._productComponent.setAddDescHandler(() => this._renderDesc())
    this._productComponent.setAddOptionsHandler(() => this._renderOptions())
    eventsForDataMaker.makeDesc.watch(() => {
      if (!this._descComponent) {
        this._renderDesc()
      }
    })
  }

  remove() {
    remove(this._productComponent)
  }

  isValidity() {
    if (!this._productComponent.getElement().checkValidity()) {
      eventsForDataMaker.toggleValidate(false)
      this._productComponent.clickBtn()
    } else {
      eventsForDataMaker.makeProduct({
        id: this._id,
        item: this._productComponent.getData(),
      })

      if (!$isFormValidate.getState()) {
        eventsForDataMaker.toggleValidate(true)
      }
    }

    return this._productComponent.getElement().checkValidity()
  }

  _renderDesc() {
    this._descComponent = new DescComponent(findCategory.getState()?.desc)
    render(this._productComponent.getElement(), this._descComponent, RenderPosition.BEFOREEND)

    this._descComponent.setInputHandler(() => {
      eventsForDataMaker.makeDesc({ id: this._id, desc: this._descComponent.getInputValue() })
    })
    this._descComponent.setRemoveDescHandler(() => this._removeDesc())
  }

  _removeDesc() {
    remove(this._descComponent)
    eventsForDataMaker.deleteDesc({ id: this._id })
  }

  _renderOptions() {
    this._optionListController = new OptionListController()
  }
}
