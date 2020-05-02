import { render, remove, RenderPosition } from '../utils/render.js'

import MenuComponent from '../components/menu'
import MenuItemComponent from '../components/menu-item'

export default class MenuController {
  constructor(container, productsModel) {
    this._container = container
    this._productsModel = productsModel

    this._menuComponent = new MenuComponent()

    this._menuItemComponent = []

    this._onViewChange = this._onViewChange.bind(this);
    this._productsModel.setDataChangeHandler(this._onViewChange)
  }

  render() {
    const header = this._container.getElement()

    render(header, this._menuComponent, RenderPosition.BEFOREEND)
    this._renderItem()
  }

  _renderItem() {
    const menuWrap = this._menuComponent.getElement()
    const menuList = this._productsModel.getMenu()
    console.log('menuList :', menuList);

    const renderMenuItems = () => {
      return menuList.map((element) => {
        const menuItemComponent = new MenuItemComponent(element)
        render(menuWrap, menuItemComponent, RenderPosition.BEFOREEND)
        return menuItemComponent
      })
    }
    this._menuItemComponent = renderMenuItems()

    this._menuItemComponent.map((element) => {
      element.setOpenButtonClickHandler(() => {
        const itemId = Number(element.getElement().id.replace(/[^+\d]/g, ''))
        const nameItem = element.getElement().textContent
        this._productsModel.setCurrentStateIntoMenu(itemId, nameItem)
      })
    })
  }

  _onViewChange() {
    console.log('object');
    // Удаляем все компоненты меню
    this._menuItemComponent.forEach(element => remove(element))
    // Очищаем массив компонентов
    this._menuItemComponent = []
    // Отрисовываем новый список меню
    this._renderItem()
  }
}
