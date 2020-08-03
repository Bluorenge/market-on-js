import AbstractComponent from '../../utils/abstarct-component'

const addDescBtn = `<div class="data-maker__tabs">
  <button class="data-maker__tab data-maker__tab--sub-category">Подкатегории</button>
  <button class="data-maker__tab data-maker__tab--product">Товары</button>
</div>`

export default class SubCategoryTabsComponent extends AbstractComponent {
  getTemplate() {
    return addDescBtn
  }

  setTabSubCategoryHandler(handler) {
    this.getElement
      .querySelector('.data-maker__tab--sub-category')
      .addEventListener('click', handler)
  }

  setTabProductHandler(handler) {
    this.getElement.querySelector('.data-maker__tab--product').addEventListener('click', handler)
  }
}
