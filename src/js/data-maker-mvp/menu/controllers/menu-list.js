import { RenderPosition, render } from '../../utils/render'
import MenuListComponent from '../components/meni-list'
import MenuAddItemsBtnComponent from '../components/menu-add-items'
import MenuItemComponent from '../components/menu-item'
import { $idContent, $isFormValidate } from '../../models/model'
import { eventsForDataMaker } from '../../models/eventsForDataMaker'
import MenuSettingItemComponent from '../components/menu-setting-item'

export default class MenuListController {
  constructor(container, data) {
    this.container = container
    this.marketData = data

    this._menuListComponent = new MenuListComponent()
    this._addItemsComponent = new MenuAddItemsBtnComponent()
    // Массив с компонентами пунктов меню
    this._menuItems = []
  }

  render() {
    // Создаём меню
    render(this.container, this._menuListComponent, RenderPosition.BEFOREEND)

    // Добавляем в меню кнопку настроек
    this._addSettingItem()

    // Создаём кнопки добавления элементов и вешаем на них обработчик
    render(this.container, this._addItemsComponent, RenderPosition.BEFOREEND)
    this._addItemsComponent.setAddCategoryHandler(() => this._addCategory())
    this._addItemsComponent.setAddProductHandler(() => this._addProduct())
  }

  _addSettingItem() {
    const menuSettingItem = new MenuSettingItemComponent()
    this._menuItems.push(menuSettingItem)
    render(this._menuListComponent.getElement(), menuSettingItem, RenderPosition.BEFOREEND)
    menuSettingItem.setDisabledBtn()

    menuSettingItem.setOpenItemHandler(() => {
      eventsForDataMaker.validateFrom()

      if ($isFormValidate.getState()) {
        this._menuItems.forEach(item => item.setEnabledBtn())
        eventsForDataMaker.changeView({ type: `setting`, id: 0 })
        menuSettingItem.setDisabledBtn()
      }
    })
  }

  _addCategory() {
    eventsForDataMaker.validateFrom()

    if ($isFormValidate.getState()) {
      const menuItem = new MenuItemComponent($idContent.getState())
      this._menuItems.push(menuItem)
      render(this._menuListComponent.getElement(), menuItem, RenderPosition.BEFOREEND)

      this._menuItems.forEach(item => item.setEnabledBtn())
      menuItem.setDisabledBtn()

      eventsForDataMaker.changeView({ type: `category`, id: $idContent.getState() })
      eventsForDataMaker.idContentIncrease()

      menuItem.setOpenItemHandler(() => {
        eventsForDataMaker.validateFrom()

        if ($isFormValidate.getState()) {
          this._menuItems.forEach(item => item.setEnabledBtn())

          const menuItemId = Number(menuItem.getElement().id.replace(/[^+\d]/g, ``))
          eventsForDataMaker.searchItem({ id: menuItemId })
          eventsForDataMaker.changeView({ type: `category`, id: menuItemId })

          menuItem.setDisabledBtn()
        }
      })
    }
  }

  _addProduct() {
    eventsForDataMaker.validateFrom()

    if ($isFormValidate.getState()) {
      const menuItem = new MenuItemComponent($idContent.getState(), false)
      this._menuItems.push(menuItem)
      render(this._menuListComponent.getElement(), menuItem, RenderPosition.BEFOREEND)

      this._menuItems.forEach(item => item.setEnabledBtn())
      menuItem.setDisabledBtn()

      eventsForDataMaker.changeView({ type: `product`, id: $idContent.getState() })
      eventsForDataMaker.idContentIncrease()

      menuItem.setOpenItemHandler(() => {
        eventsForDataMaker.validateFrom()

        if ($isFormValidate.getState()) {
          this._menuItems.forEach(item => item.setEnabledBtn())

          const menuItemId = Number(menuItem.getElement().id.replace(/[^+\d]/g, ``))
          eventsForDataMaker.searchItem({ id: menuItemId })
          eventsForDataMaker.changeView({ type: `product`, id: menuItemId })

          menuItem.setDisabledBtn()
        }
      })
    }
  }
}
