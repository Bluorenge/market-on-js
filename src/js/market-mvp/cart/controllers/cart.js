import { render, remove, RenderPosition } from '../../utils/render.js'

import CartIconComponent from '../components/cart-icon'
import CartPageComponent from '../components/cart-page'

import CartItemController from '../controllers/cart-item'

import CartModel from '../model-cart'
import { eventsForStore } from '../../main/eventsForStore'

const renderProducts = (container, setting, products, events) => {
  return products.map((item) => {
    const productController = new CartItemController(container, events)
    productController.render(setting, item)
    return productController
  })
}

export default class CartController {
  constructor(...args) {
    this._header = args[0]
    this._container = args[1]

    this._setting = args[2]
    this._productsModel = args[3]

    this._orderCallback = args[4]

    this._cartModel = new CartModel()
    this._cartIconComponent = null
    this._cartPageComponent = null

    this._showedCartProductsComponent = []

    this._removeProduct = this._removeProduct.bind(this)
    this._changeTotalPrice = this._changeTotalPrice.bind(this)
  }

  render() {
    // Обновляем иконку корзины
    this._cartModel.$cart.watch((state) => this._updateIcon(state))
    // Обновляем страницу корзины при удалении товара
    this._cartModel.$cart.watch(eventsForStore.deleteProductInCart, (state) =>
      this._renderCartPage(state)
    )
    this._cartModel.$cart.watch(
      eventsForStore.updateQuantityOfProductInCart,
      (state) => this._changeTotalPrice(state)
    )
    // Удаляем страницу корзины при её закрытии
    this._productsModel.$productList.watch(eventsForStore.toDefaultState, () =>
      this._removeCartPage()
    )
    this._productsModel.$productList.watch(eventsForStore.closeCartPage, () =>
      this._removeCartPage()
    )
  }

  _updateIcon(cartData) {
    if (this._cartIconComponent) {
      remove(this._cartIconComponent)
    }

    this._cartIconComponent = new CartIconComponent(cartData, this._setting)
    render(
      this._header.getElement(),
      this._cartIconComponent,
      RenderPosition.BEFOREEND
    )
    this._cartIconComponent.setProductCount()

    this._cartIconComponent.setOpenCartClickHandler(() => {
      eventsForStore.createCartMenu()
      eventsForStore.openCartPage()
      this._renderCartPage(cartData)
    })
  }

  _renderCartPage(cartData) {
    if (this._cartPageComponent) {
      remove(this._cartPageComponent)
    }

    this._cartPageComponent = new CartPageComponent(cartData, this._setting)
    render(
      this._container.getElement(),
      this._cartPageComponent,
      RenderPosition.BEFOREEND
    )

    this._cartPageComponent.setToMainBtnOnClickHandler(() => {
      eventsForStore.removeMenuItemsTo({ id: 0 })
      eventsForStore.toDefaultState()
    })
    if (cartData.length > 0) {
      const newProducts = renderProducts(
        this._cartPageComponent.getElement(),
        this._setting,
        cartData,
        eventsForStore
      )

      this._showedCartProductsComponent = this._showedCartProductsComponent.concat(
        newProducts
      )

      this._cartPageComponent.setMakeOrderBtnOnClickHandler(() => {
        const getOrderList = (arr) => {
          let order = []
          arr.map((item) => {
            const product = {
              name: item.name,
              count: Number(item.quantity),
              price: Number(item.price.replace(/\s/g, '')),
            }
            if (item.optionName !== undefined) {
              product.optionName = item.optionName.replace(/\:/, '')
              product.optionValue = item.optionValue
            }
            return order.push(product)
          })
          return order
        }
        const orderList = getOrderList(this._cartModel.$cart.getState())
        const totalPrice = orderList.reduce(
          (price, product) => price + product.price,
          0
        )
        this._orderCallback(orderList, totalPrice)
      })
    }
  }

  _changeTotalPrice(cart) {
    const totalPrice = cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toLocaleString('ru-RU')
    this._cartPageComponent.getTotalPriceElement().textContent = totalPrice
  }

  _removeProduct() {
    this._showedCartProductsComponent.forEach((productController) =>
      productController.destroy()
    )
    this._showedCartProductsComponent = []
  }

  _removeCartPage() {
    remove(this._cartPageComponent)
  }
}
