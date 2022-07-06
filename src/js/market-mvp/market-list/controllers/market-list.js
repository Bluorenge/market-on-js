import { render, remove, RenderPosition } from "../../utils/render";
import { elementReady } from "../../utils/utils";
import { carousel } from "../../utils/carousel&scrollbar";

import ListItemController from "./market-list-item";

import MarketListComponent from "../components/market-list";
import EmptyPageComponent from "../components/empty-search-page";
import CarouselDotsComponent from "../components/carousel-dots";
import BtnPrevComponent from "../../common-components/btn-prev";

import { eventsForStore } from "../../models/eventsForStore";
import { $productList, searchList, getContentViewType } from "../../models/products";
import { $menu, whatMenuIsIt } from "../../models/menu";

const renderListItems = (productListElement, setting, option, products) => {
    const createArrayOfProductControllers = arr => {
        return arr.map(item => {
            const productController = new ListItemController(productListElement, setting, option);
            productController.render(item);
            return productController;
        });
    };

    switch (true) {
        case `subCategory` in products:
            return createArrayOfProductControllers(products.subCategory);
        case `productsInCategory` in products:
            return createArrayOfProductControllers(products.productsInCategory);
        default:
            return createArrayOfProductControllers(products);
    }
};

export default class MarketListController {
    constructor(...args) {
        this._container = args[0];
        this._options = args[1];
        this._setting = args[2];

        this._productsControllers = [];
        this._wrap = null;
        this._btnPrevComponent = null;
        this._emptyTextComponent = null;
        this._dotsForCarouselComponent = null;
    }

    render() {
        $productList.watch(currentState => this._onDataChange(currentState));
        $productList.watch(eventsForStore.toMainPage, currentState => this._onDataChange(currentState));
        eventsForStore.openCartPage.watch(() => {
            if (this._emptyTextComponent) {
                this._removeEmptyPage();
            }
            this._removeProducts();
        });
        // Следим за созданием списка поиска
        searchList.watch(currentState => (currentState ? this._onDataChange(currentState) : false));
        // Возврат к списку до начала поиска
        eventsForStore.productListToCurrentView.watch(currentState => this._onDataChange(currentState));
    }

    _renderProductList(products) {
        this._wrap = new MarketListComponent();
        render(this._container.getElement(), this._wrap, RenderPosition.BEFOREEND);

        const newProducts = renderListItems(this._wrap.getElement(), this._setting, this._options, products);

        this._productsControllers = this._productsControllers.concat(newProducts);

        this._createCarousel();
    }

    _renderEmptyPage() {
        this._emptyTextComponent = new EmptyPageComponent();

        if (this._emptyTextComponent) {
            render(this._container.getElement(), this._emptyTextComponent, RenderPosition.BEFOREEND);
        }
    }

    _renderPrevBtn() {
        this._btnPrevComponent = new BtnPrevComponent();
        render(this._container.getElement(), this._btnPrevComponent, RenderPosition.BEFOREEND);
        this._btnPrevComponent.setPrevBtnHandler(() => {
            let menu = $menu.getState();
            if (whatMenuIsIt(menu, "Поиск")) {
                eventsForStore.deleteLastMenuItem();
                eventsForStore.clearSearchInput();
                eventsForStore.productListToCurrentView($productList.getState());
            } else {
                const id = menu[menu.length - 2].id;
                const name = menu[menu.length - 2].name;
                eventsForStore.deleteLastMenuItem();
                eventsForStore.findProductsInDefaultProductList({ id, name });
            }
        });
    }

    _createCarousel() {
        // elementReady работает только по классу
        elementReady(this._container.getElement(), `.${this._wrap.getElement().classList[0]}`).then(() => {
            const width = this._productsControllers.reduce((acc, item) => acc + item.getComponent().offsetWidth, 0);
            if (!this._dotsForCarouselComponent) {
                this._dotsForCarouselComponent = new CarouselDotsComponent();
                render(this._container.getElement(), this._dotsForCarouselComponent, RenderPosition.AFTERBEGIN);
            }
            carousel(this._options, this._container.getElement(), this._wrap.getElement(), width);
        });
    }

    _onDataChange(currentState) {
        if (this._productsControllers.length > 0) {
            this._removeProducts();
        }

        if (this._emptyTextComponent) {
            this._removeEmptyPage();
        }

        const contentViewType = getContentViewType(currentState, $productList.defaultState);

        switch (contentViewType) {
            case "MAIN_PAGE":
                this._renderProductList(currentState);
                break;
            case "CATEGORIES_LIST":
            case "PRODUCT_LIST":
            case "SEARCH_LIST":
                this._renderProductList(currentState);
                this._renderPrevBtn();
                break;
            case "EMPTY_PAGE":
                this._renderEmptyPage();
        }
    }

    _removeProducts() {
        remove(this._wrap);

        if (this._btnPrevComponent) {
            remove(this._btnPrevComponent);
        }

        if (this._dotsForCarouselComponent) {
            remove(this._dotsForCarouselComponent);
            this._dotsForCarouselComponent = null;
            // ! привязка к классу
            this._container.getElement().classList.remove(`market-content--shadow`);
        }

        this._productsControllers.forEach(productController => productController.destroy());
        this._productsControllers = [];
    }

    _removeEmptyPage() {
        remove(this._emptyTextComponent);
    }
}
