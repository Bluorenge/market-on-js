import { RenderPosition, render, remove } from '../../utils/render'

import CategoryComponent from '../components/category'
import { $idContent, $isFormValidate, $productList, findItem, $currentId } from '../../models/model'
import { eventsForDataMaker } from '../../models/eventsForDataMaker'
import ProductController from './product'
import CategoryEntryStateComponent from '../components/category-entry-state'
import SubCategoryTabsComponent from '../components/tabs'
import TabContentController from './tab-content'

export default class SubCategoryController {
  constructor(container) {
    this.container = container

    this._id = Number(this.container.getElement().id.replace(/[^+\d]/g, ``))
    this._categoryComponent = null
    this._subCategories = []
    // this._entryState = null
    this._tabContent = null
  }

  render() {
    eventsForDataMaker.searchItem({ id: this._id })

    // if (findItem) {
    this._categoryComponent = new CategoryComponent(`подкатегории`, this._id, findItem)
    render(this.container.getElement(), this._categoryComponent, RenderPosition.BEFOREEND)

    this._categoryComponent.setRemoveCategoryBtnHandler(() => {
      eventsForDataMaker.changeView({ type: `setting`, id: 0 })
      eventsForDataMaker.deleteMenuItem(this._id)
      eventsForDataMaker.deleteCategory({ id: this._id })
    })
    this._categoryComponent.setAddCategoryHandler(() => {
      this._getData()
      eventsForDataMaker.validateFrom()

      if ($isFormValidate.getState()) {
        this._tabContent = new TabContentController(this._categoryComponent)
        this._renderSubCategory(this._categoryComponent)
        this._categoryComponent.hideBtn(`product`)
      }
    })
    this._categoryComponent.setInputsHandler(() => this._getData())
    // } else {
    //   this._entryState = new CategoryEntryStateComponent()
    //   render(this.container.getElement(), this._entryState, RenderPosition.BEFOREEND)
    //   this._entryState.setAddProductBtnHandler(() => )
    // }

    // Если у элемента есть подкатегории
    if (findItem?.subCategory) {
      this._renderSubCategory(this._categoryComponent, findItem)
    }
  }

  remove() {
    remove(this._categoryComponent)
  }

  isValidity() {
    if (!this._categoryComponent.getElement().checkValidity()) {
      eventsForDataMaker.toggleValidate(false)
      this._categoryComponent.clickBtn()
    } else if (!$isFormValidate.getState()) {
      eventsForDataMaker.toggleValidate(true)
    }

    return this._categoryComponent.getElement().checkValidity()
  }

  _getData() {
    const categoryData = this._categoryComponent.getData()
    eventsForDataMaker.makeCategory({ id: this._id, item: categoryData })

    eventsForDataMaker.changeMenuItemName({ id: this._id, name: categoryData.name })
  }
}
