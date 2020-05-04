import { render, replace, remove, RenderPosition } from '../utils/render.js'
import CartIconComponent from '../components/cart-icon'
import CartPageComponent from '../components/cart-page'

export default class CartController {
  constructor(header, container, productsModel) {
    this._header = header
    this._container = container
    this._productsModel = productsModel

    this._settings = this._productsModel.getSettings()

    this._cartIconComponent = null
    this._cartPageComponent = null

    this._openCart = this._openCart.bind(this)
    this._renderCartPage = this._renderCartPage.bind(this)
    this._backToMain = this._backToMain.bind(this)

    // При добавлении товара в коризину, обновляем корзину
    this._onAddToCart = this._onAddToCart.bind(this)
    this._productsModel.setDataCartChangeHandler(this._onAddToCart)

    // Удаляем обёртку при изменении состояния
    // this._removeCartPage = this._removeCartPage.bind(this)
    // this._productsModel.setDataChangeHandler(this._removeCartPage)
  }

  renderCartIcon() {
    this._cartIconComponent = new CartIconComponent()
    render(
      this._header.getElement(),
      this._cartIconComponent,
      RenderPosition.BEFOREEND
    )
    this._cartIconComponent.setOpenCartClickHandler(this._openCart)
    this._cartIconComponent.setOpenCartClickHandler(this._renderCartPage)
  }

  _updateIcon() {
    remove(this._cartIconComponent)

    const cartData = this._productsModel.getCart()
    this._cartIconComponent = new CartIconComponent(cartData, this._settings)
    this._cartIconComponent.setProductCount()
    render(
      this._header.getElement(),
      this._cartIconComponent,
      RenderPosition.BEFOREEND
    )
    this._cartIconComponent.setOpenCartClickHandler(this._openCart)
    this._cartIconComponent.setOpenCartClickHandler(this._renderCartPage)
  }

  _onAddToCart() {
    this._updateIcon()
  }

  _renderCartPage() {
    const cartData = this._productsModel.getCart()
    this._cartPageComponent = new CartPageComponent(cartData, this._settings)
    render(
      this._container.getElement(),
      this._cartPageComponent,
      RenderPosition.BEFOREEND
    )
    this._cartPageComponent.setToMainBtnOnClickHandler(this._backToMain)
  }

  _removeCartPage() {
    remove(this._cartPageComponent)
  }

  _openCart() {
    this._productsModel.setOpenCart()
  }

  _backToMain() {
    this._productsModel.setCurrentState()
  }
}
