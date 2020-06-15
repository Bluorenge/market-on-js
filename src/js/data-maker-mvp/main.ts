import { RenderPosition, render } from './utils/render'
import ContentController from './content/controllers/content'
import MenuComponent from './common-component/menu'
import MenuListController from './menu/controllers/menu-list'

const mainWrap: HTMLFormElement = document.querySelector(`.data-maker`)
const leftContent = new MenuComponent()

render(mainWrap, leftContent, RenderPosition.BEFOREEND)

const content = new ContentController(mainWrap)
content.render()

const menu = new MenuListController(leftContent.getElement(), content)
menu.render()
