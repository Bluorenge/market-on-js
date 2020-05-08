import { render, replace, remove, RenderPosition } from '../utils/render.js'
import CartIconComponent from '../components/cart-icon'
import CartPageComponent from '../components/cart-page'
import CartItemController from '../controller/cart-item'

import {
  setting,
  $cart,
  createCartMenu,
  openCartPage,
  closeCartPage,
  $productList,
  removeMenuItemsTo,
  deleteProductInCart
} from '../models/products'

const renderProducts = (container, setting, products) => {
  return products.map((item) => {
    const productController = new CartItemController(container)
    productController.render(setting, item)
    return productController
  })
}

export default class CartController {
  constructor(header, container) {
    this._header = header
    this._container = container

    this._cartIconComponent = null
    this._cartPageComponent = null

    this._showedCartProductsComponent = []

    this._removeProduct = this._removeProduct.bind(this)
  }

  render() {
    // Обновляем иконку корзины
    $cart.watch((store) => this._updateIcon(store))
    // Обновляем страницу корзины при удалении товара
    $cart.watch(deleteProductInCart, (store) => this._renderCartPage(store))
    // Удаляем страницу корзины при её закрытии
    $productList.watch(closeCartPage, () => this._removeCartPage())
  }

  _updateIcon(cartData) {
    if (this._cartIconComponent !== null) {
      remove(this._cartIconComponent)
    }

    this._cartIconComponent = new CartIconComponent(cartData, setting)
    render(
      this._header.getElement(),
      this._cartIconComponent,
      RenderPosition.BEFOREEND
    )
    this._cartIconComponent.setProductCount()

    this._cartIconComponent.setOpenCartClickHandler(() => {
      // Вызываем обработчик создания меню
      createCartMenu()
      openCartPage()
      this._renderCartPage(cartData)
    })
  }

  _renderCartPage(cartData) {
    if (this._cartPageComponent !== null) {
      remove(this._cartPageComponent)
    }
    // Создаём компонент страницы корзины
    this._cartPageComponent = new CartPageComponent(cartData, setting)
    render(
      this._container.getElement(),
      this._cartPageComponent,
      RenderPosition.BEFOREEND
    )

    this._cartPageComponent.setToMainBtnOnClickHandler(() => {
      removeMenuItemsTo({ id: 0 })
      closeCartPage()
    })

    if (cartData.length > 0) {
      const newProducts = renderProducts(
        this._cartPageComponent.getElement(),
        setting,
        cartData
      )

      this._showedCartProductsComponent = this._showedCartProductsComponent.concat(
        newProducts
      )
    }
  }

  _removeProduct() {
    // Удаляем все отображаемые задачи
    this._showedCartProductsComponent.forEach((productController) =>
      productController.destroy()
    )
    // Очищаем массив с показанными задачами
    this._showedCartProductsComponent = []
  }

  _removeCartPage() {
    remove(this._cartPageComponent)
  }
}
