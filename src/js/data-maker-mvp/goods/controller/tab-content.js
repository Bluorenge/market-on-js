import { RenderPosition, render } from '../../utils/render'
import { eventsForDataMaker } from '../../models/eventsForDataMaker'
import SubCategoryTabsComponent from '../components/tabs'
import TabContentWrapComponent from '../components/tabs-content'
import { createStore } from 'effector'

const $tabContent = createStore(`category`)
$tabContent.on(eventsForDataMaker.changeViewTab, (_, type) => type)

export default class TabContentController {
  constructor(container) {
    this.container = container

    this._tabWrap = new TabContentWrapComponent()
    this._viewController = null
  }

  render() {
    render(this.container.getElement(), this._tabWrap, RenderPosition.BEFOREEND)
    $tabContent.updates.watch(state => this._changeView(state.type))
  }

  _changeView(type) {
    console.log('type :', type)
    this._viewController.remove()

    switch (type) {
      case `category`:
        this._renderView(SubCategoryController)
        break
      case `product`:
        this._renderView(ProductController)
        break
      default:
        break
    }
  }

  _renderView(classTypeOfController) {
    this._viewController = new classTypeOfController(this._tabWrap)
    this._viewController.render()
  }
}
