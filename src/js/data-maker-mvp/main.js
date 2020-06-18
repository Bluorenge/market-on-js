import { RenderPosition, render } from './utils/render'
import ContentController from './content/controllers/content'
import LeftContentComponent from './common-component/leftContent'
import MenuListController from './menu/controllers/menu-list'

class DataMaker {
  constructor(element, setting, products) {
    this.container = document.querySelector(`${element}`)
    this.marketData =
      setting && products
        ? {
            setting: JSON.parse(setting),
            products: JSON.parse(products),
          }
        : null

    this.init()
  }

  init() {
    const leftContent = new LeftContentComponent()
    render(this.container, leftContent, RenderPosition.BEFOREEND)

    const rightContent = new ContentController(this.container)
    rightContent.render()

    const menu = new MenuListController(leftContent.getElement())
    menu.render()
  }
}

export const datat = new DataMaker(`.data-maker`)
