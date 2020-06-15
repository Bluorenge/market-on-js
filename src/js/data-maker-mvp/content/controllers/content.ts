import { RenderPosition, render } from '../../utils/render'
import ContentComponent from '../components/content'
import GlobalSettingController from '../../global-setting/controllers/global-setting'
import { IAbstractComponent } from '../../utils/abstarct-component'

// interface IComponentClass extends IAbstractComponent {
//   setAddCategoryHandler?(handler: () => void): void
//   setAddProductHandler?(handler: () => void): void
// }

export interface IContentController {
  container: HTMLElement
  changeView(type: string): void
}

export default class ContentController implements IContentController {
  public container: HTMLElement
  private readonly contentComponent: IAbstractComponent

  constructor(container: HTMLElement) {
    this.container = container
    this.contentComponent = new ContentComponent()
  }

  public render(): void {
    render(this.container, this.contentComponent, RenderPosition.BEFOREEND)
  }

  public changeView(type: string): void {
    switch (type) {
      case `setting`:
        const setting = new GlobalSettingController(this.contentComponent)
        setting.render()
        break

      default:
        break
    }
  }
}
