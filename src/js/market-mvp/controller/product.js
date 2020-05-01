import { render, replace, remove, RenderPosition } from '../utils/render.js'
import ProductItemComponent from '../components/product'

export default class ProductController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container
    this._onDataChange = onDataChange
    this._onViewChange = onViewChange
    this._productComponent = null
  }

  render(setting, product) {
    // Присваиваем переменной в конструктуре экземляр КОМПОНЕНТА (представления)
    this._productComponent = new ProductItemComponent(setting, product)
    // Отрисовываем КОМПОНЕНТ в родительском контейнере
    render(this._container, this._productComponent, RenderPosition.BEFOREEND)
    const productElement = this._productComponent.getElement()

    // Вешаем обработчик на КОМПОНЕНТ
    this._productComponent.setOpenButtonClickHandler(() => {
      const itemName = productElement.querySelector(
        '.market-products__product-title'
      ).textContent

      const itemId = Number(productElement.id.replace(/[^+\d]/g, ''))

      this._onViewChange(itemId, itemName)
    })
  }

  destroy() {
    // Удаляем компонент
    remove(this._productComponent);
  }
}
