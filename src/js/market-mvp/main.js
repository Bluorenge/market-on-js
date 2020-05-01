import { globalSetting, productList } from './mocks/data'
import { render, RenderPosition } from './utils/render'

import ProductsModel from './models/products'

import InputSearchComponent from './components/input-search'
import HeaderComponent from './components/header'
import MainContentComponent from './components/content-wrap'
import CartIconComponent from './components/cart-icon'

import ProductListController from './controller/product-list'
import MenuController from './controller/menu'

// Корневой элемент магазина
const marketMainElement = document.querySelector('.market')

// ---Шапка
const header = new HeaderComponent()
render(marketMainElement, header, RenderPosition.BEFOREEND)

// ---Поиск
const inputSearch = new InputSearchComponent()
// Создаём поиск внутри шапки
render(header.getElement(), inputSearch, RenderPosition.BEFOREEND)

// --Иконка корзины
const cartIcon = new CartIconComponent()
render(header.getElement(), cartIcon, RenderPosition.BEFOREEND)

// --Модуль (данные)
const productsModel = new ProductsModel(globalSetting, productList)

// --Презнетер (бизнес-логика) меню
const menuController = new MenuController(header, productsModel)
menuController.render()

// ---Обёртка контента
const mainContent = new MainContentComponent()
// Саздаём обёртку контента
render(marketMainElement, mainContent, RenderPosition.BEFOREEND)

// --Презентер списка продуктов
const productListController = new ProductListController(mainContent, productsModel)
productListController.render()