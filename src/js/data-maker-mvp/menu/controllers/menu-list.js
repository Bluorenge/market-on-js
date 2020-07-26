import { RenderPosition, render, remove } from '../../utils/render'
import MenuListComponent from '../components/meni-list'
import MenuAddItemsBtnComponent from '../components/menu-add-items'
import MenuItemComponent from '../components/menu-item'
import { $idContent, $isFormValidate, $productList, $currentId, findItem } from '../../models/model'
import { eventsForDataMaker } from '../../models/eventsForDataMaker'
import MenuSettingItemComponent from '../components/menu-setting-item'

const createMenu = arr => {
  arr.forEach(item => {
    if (`subCategory` in item) {
      createMenu(item.subCategory)
    } else if (`productsInCategory` in item) {
      createMenu(item.productsInCategory)
    } else {
      return item
    }
  })
}

export default class MenuListController {
  constructor(container) {
    this.container = container

    this.marketData = $productList.getState()

    this._menuSettingItem = new MenuSettingItemComponent()
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
    this._addItemsComponent.setAddMenuItemHandler(e => this._addMenuItem(e.target))

    if (this.marketData) {
      this.marketData.forEach(item => {
        let menuItem
        if (`subCategory` in item && `productsInCategory` in item) {
          menuItem = new MenuItemComponent(item.id)
        } else {
          menuItem = new MenuItemComponent(item.id)
        }
        menuItem.setNameMenuItem(item.name)
        this._menuItems.push(menuItem)
        render(this._menuListComponent.getElement(), menuItem, RenderPosition.BEFOREEND)
        menuItem.setOpenItemHandler(() => {
          eventsForDataMaker.validateFrom()

          if ($isFormValidate.getState()) {
            this._menuItems.forEach(item => item.setEnabledBtn())

            if (`subCategory` in item && `productsInCategory` in item) {
              eventsForDataMaker.changeView({ type: `product`, id: menuItem.getIndex() })
            } else {
              eventsForDataMaker.changeView({ type: `category`, id: menuItem.getIndex() })
            }

            menuItem.setDisabledBtn()
          }
        })
      })
    }

    eventsForDataMaker.changeMenuItemName.watch(name => {
      const menuId = this._menuItems.find(item => item.getIndex() === name.id)
      if (menuId.getNameMenuItem() !== name.name) {
        menuId.setNameMenuItem(name.name)
      }
    })
    eventsForDataMaker.deleteMenuItem.watch(id => {
      this._menuSettingItem.setDisabledBtn()
      this._menuItems.forEach((item, index, arr) => {
        if (item.getIndex() === id) {
          remove(item)
          arr.splice(index, 1)
        }
      })
      if (this._menuItems.length === 1) {
        this._addItemsComponent.enabledBtn()
      }
    })
  }

  _addSettingItem() {
    this._menuItems.push(this._menuSettingItem)
    render(this._menuListComponent.getElement(), this._menuSettingItem, RenderPosition.BEFOREEND)
    this._menuSettingItem.setDisabledBtn()

    this._menuSettingItem.setOpenItemHandler(() => {
      eventsForDataMaker.validateFrom()

      if ($isFormValidate.getState()) {
        this._menuItems.forEach(item => item.setEnabledBtn())
        eventsForDataMaker.changeView({ type: `setting`, id: 0 })
        this._menuSettingItem.setDisabledBtn()
      }
    })
  }

  _addMenuItem(btn) {
    eventsForDataMaker.validateFrom()

    if ($isFormValidate.getState()) {
      let menuItem
      if (btn.classList.contains('data-maker__btn--add-category')) {
        menuItem = new MenuItemComponent($idContent.getState())
      } else {
        menuItem = new MenuItemComponent($idContent.getState(), false)
      }
      this._menuItems.push(menuItem)
      render(this._menuListComponent.getElement(), menuItem, RenderPosition.BEFOREEND)

      // Активируем все кнопки
      this._menuItems.forEach(item => item.setEnabledBtn())
      // Отключаем созданную кнопку
      menuItem.setDisabledBtn()

      if (btn.classList.contains('data-maker__btn--add-category')) {
        this._addItemsComponent.disableBtn('product')
        eventsForDataMaker.changeView({ type: `category`, id: $idContent.getState() })
      } else {
        this._addItemsComponent.disableBtn('category')
        eventsForDataMaker.changeView({ type: `product`, id: $idContent.getState() })
      }
      eventsForDataMaker.idContentIncrease()

      menuItem.setOpenItemHandler(() => {
        eventsForDataMaker.validateFrom()

        if ($isFormValidate.getState()) {
          this._menuItems.forEach(item => item.setEnabledBtn())

          if (btn.classList.contains('data-maker__btn--add-category')) {
            eventsForDataMaker.changeView({ type: `product`, id: menuItem.getIndex() })
          } else {
            eventsForDataMaker.changeView({ type: `category`, id: menuItem.getIndex() })
          }

          menuItem.setDisabledBtn()
        }
      })
    }
  }
}
