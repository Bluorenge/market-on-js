import AbstractComponent from './abstract-component.js'

// Шаблон списка с категориями/товарами и его добавление на страницу
const createProductListTemplateOld = (
  productListArray,
  globalSetting,
  contentId
) => {
  // Обёртка контента страницы
  const marketContentWrap = document.querySelector('.market-content')

  const productItemHtml = (item) => `
  <div id="product-${item.id}" class='market-products__product'>
    <div class="market-products__product-wrap">
      <h2 class='market-products__product-title'>${item.name}</h2>
      <div class='market-products__product-img-wrap'><img src='https://media.lpgenerator.ru/images/${
        globalSetting.userId
      }/${item.img}'></div>
      <div class='market-products__product-bottom'>
        ${
          item.price !== undefined
            ? `<span class='market-products__product-price'>${item.price.toLocaleString(
                'ru-RU'
              )} ${globalSetting.currency}</span>`
            : ''
        }
        <button class='market-products__product-btn market-btn'>Подробнее</button>
      </div>
    </div>
  </div>`

  // Создаём тег li категории/товара с информацией из [] с информацией о категориях и о товарах
  const newProductList = productListArray
    .map((productItem) => {
      if (productItem.active) {
        return productItemHtml(productItem)
      } else if (
        'subCategory' in productItem ||
        'productsInCategory' in productItem
      ) {
        return productItemHtml(productItem)
      }
    })
    .join('')

  // Создаём тег ul и вставляем туда получившиеся пункты
  const productListWrap = document.createElement('div')
  // Задаём ему класс
  productListWrap.className = 'market-products__list market-content--fade-in'
  // Добавляем список
  productListWrap.innerHTML = newProductList
  // Добавляем кнопки для карусели
  marketContentWrap.prepend('<div role="tablist" class="dots"></div>')

  if (contentId !== undefined) {
    marketContentWrap.id = contentId
  }
}

const createProductListTemplate = () => {
  return `<div class="market-products__list market-content--fade-in"></div>`
}

export default class ProductListComponent extends AbstractComponent {
  getTemplate() {
    return createProductListTemplate()
  }
}
