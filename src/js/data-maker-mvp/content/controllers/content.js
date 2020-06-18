import { RenderPosition, render } from '../../utils/render'
import ContentComponent from '../components/content'
import GlobalSettingController from '../../global-setting/controllers/global-setting'
import CategoryController from '../../goods/controller/category'
import ProductController from '../../goods/controller/product'
import { $typeView } from '../../models/model'
import { eventsForDataMaker } from '../../models/eventsForDataMaker'

export default class ContentController {
  constructor(container) {
    this.container = container

    this._contentComponent = new ContentComponent()
    this._viewController = null
  }

  render() {
    render(this.container, this._contentComponent, RenderPosition.BEFOREEND)
    this._renderView(GlobalSettingController)
    $typeView.updates.watch(state => this._changeView(state.type, state.id))
    eventsForDataMaker.validateFrom.watch(() => this._viewController.isValidity())
  }

  _changeView(type, idContent) {
    this._contentComponent.getElement().id = `content-` + idContent

    this._viewController.remove()

    switch (type) {
      case `setting`:
        this._renderView(GlobalSettingController)
        break
      case `category`:
        this._renderView(CategoryController)
        break
      case `product`:
        this._renderView(ProductController)
        break
      default:
        break
    }
  }

  _renderView(classTypeOfController) {
    this._viewController = new classTypeOfController(this._contentComponent.getElement())
    this._viewController.render()
  }
}
