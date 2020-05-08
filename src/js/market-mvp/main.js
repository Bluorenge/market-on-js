import { globalSetting, productList } from './mocks/data'
import { render, RenderPosition } from './utils/render'

import HeaderComponent from './components/header'
import MainContentComponent from './components/content-wrap'

import MenuController from './controller/menu'
import SearchInputController from './controller/search-input'
import ProductListController from './controller/product-list'
import CartController from './controller/cart'

// Корневой элемент магазина
const marketMainElement = document.querySelector('.market')

// ---Шапка
const header = new HeaderComponent()
render(marketMainElement, header, RenderPosition.BEFOREEND)

// ---Поиск
const inputSearch = new SearchInputController(header)
// Создаём поиск внутри шапки
inputSearch.render()

// --Презентер (бизнес-логика) меню
const menuController = new MenuController(header)
menuController.render()

// ---Обёртка контента
const mainContent = new MainContentComponent()
// Саздаём обёртку контента
render(marketMainElement, mainContent, RenderPosition.BEFOREEND)

// --Презентер списка продуктов
const productListController = new ProductListController(mainContent)
productListController.render()
// --Презентер страницы товара
// const productListController = new ProductListController(mainContent)
// --Презентер корзины
const cartController = new CartController(header, mainContent)
cartController.render()
