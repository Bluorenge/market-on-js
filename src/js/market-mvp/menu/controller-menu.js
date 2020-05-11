import { render, remove, RenderPosition } from '../utils/render.js'

import MenuComponent from './components/menu'
import MenuItemComponent from './components/menu-item'

import { $menu, removeMenuItemsTo } from './model-menu'

import {
  findProductsInDefaultProductList,
  closeCartPage,
} from '../products/model-products'

export default class MenuController {
  constructor(container) {
    this._container = container

    this._menuComponent = new MenuComponent()
    this._menuItemComponent = []

    this._onViewChange = this._onViewChange.bind(this)
  }

  render() {
    const header = this._container.getElement()
    render(header, this._menuComponent, RenderPosition.BEFOREEND)

    $menu.watch((menu) => this._onViewChange(menu))
  }

  _renderItem(menu) {
    const menuWrap = this._menuComponent.getElement()

    const renderMenuItems = (arr) => {
      return arr.map((element) => {
        const menuItemComponent = new MenuItemComponent(element)
        render(menuWrap, menuItemComponent, RenderPosition.BEFOREEND)
        return menuItemComponent
      })
    }
    this._menuItemComponent = renderMenuItems(menu)
    const isCartMenu =
      this._menuItemComponent[this._menuItemComponent.length - 1].getElement()
        .textContent === 'Корзина'

    this._menuItemComponent.map((element, index) => {
      // Если это единственный элемент
      if (this._menuItemComponent.length == 1) {
        return
      }
      // Если это меню корзины и не последний элемент
      else if (isCartMenu && index !== this._menuItemComponent.length - 1) {
        element.setOpenButtonClickHandler(() => {
          removeMenuItemsTo({ id: 0 })
          closeCartPage()
        })
      }
      // Если это не последний элемент
      else if (index !== this._menuItemComponent.length - 1) {
        element.setOpenButtonClickHandler(() => {
          const id = Number(element.getElement().id.replace(/[^+\d]/g, ''))
          const name = element.getElement().textContent

          removeMenuItemsTo({ id, name })
          findProductsInDefaultProductList({ id, name })
        })
      }
    })
  }

  _onViewChange(menu) {
    if (this._menuItemComponent.length) {
      this._menuItemComponent.forEach((element) => remove(element))
      this._menuItemComponent = []
    }
    this._renderItem(menu)
  }
}
