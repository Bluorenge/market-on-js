import { RenderPosition, render } from '../../utils/render'

import AddItemsComponent from '../components/addItems'
import AddCategoryComponent from '../components/categoryFields'

interface IComponentClass {
  getTemplate(): string
  getElement(): HTMLElement
  removeElement(): void
  setAddCategoryHandler(handler: () => void): void
  setAddProductHandler(handler: () => void): void
}

export default class AddItemsEntryController {
  public container: HTMLElement
  private readonly entryAddItems: IComponentClass

  constructor(container: HTMLElement) {
    this.container = container
    this.entryAddItems = new AddItemsComponent()
  }

  public render(): void {
    render(this.container, this.entryAddItems, RenderPosition.BEFOREEND)
    this.entryAddItems.setAddCategoryHandler(() => this.addCategory())
  }

  private addCategory(): void {
    const addCategoryComponent = new AddCategoryComponent()
    render(this.container, addCategoryComponent, RenderPosition.BEFOREEND)
  }
}
