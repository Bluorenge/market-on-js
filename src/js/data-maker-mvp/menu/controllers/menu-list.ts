import { RenderPosition, render } from '../../utils/render'
import MenuListComponent from '../components/meni-list'
import MenuAddItemsBtnComponent from '../components/menu-add-items'
import { IContentController } from '../../content/controllers/content'

interface IComponentClass {
  getTemplate(): string
  getElement(): HTMLElement
  removeElement(): void
  setAddCategoryHandler?(handler: () => void): void
  setAddProductHandler?(handler: () => void): void
  setSettingHandler?(handler: () => void): void
}

export default class MenuListController {
  public container: HTMLElement
  private readonly content: IContentController
  private readonly menuList: IComponentClass
  private readonly addItems: IComponentClass

  constructor(container: HTMLElement, content: IContentController) {
    this.container = container
    this.content = content
    this.menuList = new MenuListComponent()
    this.addItems = new MenuAddItemsBtnComponent()
  }

  public render(): void {
    render(this.container, this.menuList, RenderPosition.BEFOREEND)
    this.menuList.setSettingHandler(() => this.showSetting())

    render(this.container, this.addItems, RenderPosition.BEFOREEND)
    this.addItems.setAddCategoryHandler(() => this.addCategory())
    this.addItems.setAddProductHandler(() => this.addProduct())
  }

  private showSetting(): void {
    this.content.changeView(`setting`)
  }

  private addCategory(): void {
    // console.log(`object`)
  }

  private addProduct(): void {
    // console.log(`object`)
  }
}
