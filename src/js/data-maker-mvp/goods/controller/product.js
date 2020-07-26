import { RenderPosition, render, remove } from '../../utils/render'
import ProductComponent from '../components/product'
import DescComponent from '../components/desc'
import OptionListController from './optionList'
import { eventsForDataMaker } from '../../models/eventsForDataMaker'
import { $isFormValidate, findItem, currentValue, $currentId } from '../../models/model'
import AddDescBtnComponent from '../../goods/components/add-desc-btn'
import AddOptionsBtnComponent from '../../goods/components/add-option-btn'

export default class ProductController {
  constructor(container, idInnerCategory) {
    this.container = container
    this.idInnerCategory = idInnerCategory

    // Если это корневой товар, то id контекта, иначе id категории
    this._id = Number(this.container.getElement().id.replace(/[^+\d]/g, ``))
    this._data = null

    this._productComponent = null
    this._descComponent = null
    this._optionListController = null
    this._addDescBtnComponent = new AddDescBtnComponent()
    this._addOptionsBtnComponent = new AddOptionsBtnComponent()
  }

  render() {
    eventsForDataMaker.searchItem({ id: this.idInnerCategory ? this.idInnerCategory : this._id })
    this._data = findItem

    if (this.idInnerCategory) {
      this._productComponent = new ProductComponent(this._data, this.idInnerCategory)
      eventsForDataMaker.makeProduct({ id: this.idInnerCategory, parentId: this._id })
    } else {
      this._productComponent = new ProductComponent(this._data)
      eventsForDataMaker.makeProduct({ id: this._id })
    }

    // Отрисовка продукта
    render(this.container.getElement(), this._productComponent, RenderPosition.BEFOREEND)
    this._productComponent.setRemoveProductBtnHandler(() => {
      eventsForDataMaker.deleteProduct({
        id: this.idInnerCategory ? this.idInnerCategory : this._id,
      })

      if (!this.idInnerCategory) {
        eventsForDataMaker.changeView({ type: `setting`, id: 0 })
        eventsForDataMaker.deleteMenuItem(this._id)
      }
    })

    // Кнопка добавления описания
    render(this._productComponent.getElement(), this._addDescBtnComponent, RenderPosition.BEFOREEND)
    this._addDescBtnComponent.setAddDescHandler(() => {
      if (this.idInnerCategory) {
        eventsForDataMaker.validateFrom()
        if ($isFormValidate.getState()) {
          this._renderDesc()
        }
      } else if (this.isValidity()) {
        this._renderDesc()
      }
    })

    // Кнопка добавления опций
    render(
      this._productComponent.getElement(),
      this._addOptionsBtnComponent,
      RenderPosition.BEFOREEND,
    )
    this._addOptionsBtnComponent.setAddOptionsHandler(() => {
      if (this.idInnerCategory) {
        eventsForDataMaker.validateFrom()
        if ($isFormValidate.getState()) {
          this._renderOptions()
        }
      } else if (this.isValidity()) {
        this._renderOptions()
      }
    })

    // Обработчик на инпуты
    this._productComponent.setInputsHandler(() => this._getData())

    // Если есть описание
    if (this._data?.desc) {
      this._renderDesc()
    }
    // Если есть опции
    if (this._data?.options) {
      this._renderOptions()
    }

    // Следим за удалением опций
    eventsForDataMaker.deleteOptions.watch(() => this._removeOptions())
  }

  remove() {
    remove(this._productComponent)
  }

  isValidity() {
    if (!this._productComponent.getElement().checkValidity()) {
      eventsForDataMaker.toggleValidate(false)
      this._productComponent.clickBtn()
    } else if (!$isFormValidate.getState()) {
      eventsForDataMaker.toggleValidate(true)
    }

    return this._productComponent.getElement().checkValidity()
  }

  _getData() {
    const basicData = this._productComponent.getData()
    const descData = this._descComponent ? { desc: this._descComponent.getInputValue() } : undefined
    const optionsData = this._optionListController
      ? { options: this._optionListController.getData() }
      : undefined

    eventsForDataMaker.updateProduct({
      id: this.idInnerCategory ? this.idInnerCategory : this._id,
      item: Object.assign(basicData, descData, optionsData),
    })

    if (!this.idInnerCategory) {
      eventsForDataMaker.changeMenuItemName({ id: this._id, name: basicData.name })
    }
  }

  _renderDesc() {
    this._addDescBtnComponent.hide()
    this._descComponent = new DescComponent(this._data?.desc)
    render(this._productComponent.getElement(), this._descComponent, RenderPosition.BEFOREEND)

    this._descComponent.setInputHandler(() => {
      eventsForDataMaker.makeDesc({
        id: this.idInnerCategory ? this.idInnerCategory : this._id,
        desc: this._descComponent.getInputValue(),
      })
    })
    this._descComponent.setRemoveDescHandler(() => this._removeDesc())
  }

  _removeDesc() {
    eventsForDataMaker.deleteDesc({
      id: this.idInnerCategory ? this.idInnerCategory : this._id,
      desc: this._descComponent.getInputValue(),
    })
    this._addDescBtnComponent.show()
    remove(this._descComponent)
  }

  _renderOptions() {
    this._addOptionsBtnComponent.hide()

    this._optionListController = new OptionListController(
      this._productComponent,
      this.idInnerCategory ? this.idInnerCategory : this._id,
    )
    this._optionListController.render()

    eventsForDataMaker.makeOptions({ id: this.idInnerCategory ? this.idInnerCategory : this._id })
  }

  _removeOptions() {
    this._optionListController.destroy()
    this._optionListController = null
    this._addOptionsBtnComponent.show()
  }
}
