import { RenderPosition, render } from '../../utils/render'
import GlobalSettingComponent from "../components/global-setting"

interface IComponentClass {
  getTemplate(): string
  getElement(): HTMLElement
  removeElement(): void
}

export default class GlobalSettingController {
  public container: HTMLElement
  private readonly globalSetting: IComponentClass

  constructor(container: HTMLElement) {
    this.container = container
    this.globalSetting = new GlobalSettingComponent()
  }

  public render(): void {
    render(this.container, this.globalSetting, RenderPosition.BEFOREEND)
  }
}
