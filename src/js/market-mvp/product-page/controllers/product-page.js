import { render, remove, RenderPosition } from "../../utils/render.js";
import { eventsForStore } from "../../models/eventsForStore";
import { animationForAddProductToCart } from "../../utils/utils";

import ProductPageComponent from "../components/product-page";
import BtnPrevComponent from "../../common-components/btn-prev";

import { productPage } from "../../models/products";
import { $menu } from "../../models/menu";

export default class ProductPageController {
    constructor(container, setting) {
        this._container = container;
        this._setting = setting;

        this._productPageComponent = null;
        this._btnPrevComponent = null;
        // Наблюдаем за появлением стора с продуктом
        productPage.watch(state => {
            eventsForStore.clearSearchInput();
            eventsForStore.disabledSearch();
            this._renderCartPage(state);
        });
        eventsForStore.closeProductPage.watch(() => this._removeCartPage());
        eventsForStore.openCartPage.watch(() => this._removeCartPage());
    }

    _renderCartPage(product) {
        this._productPageComponent = new ProductPageComponent(this._setting, product);
        render(this._container.getElement(), this._productPageComponent, RenderPosition.BEFOREEND);

        let productPrice = this._productPageComponent.getPriceElement();

        this._productPageComponent.setOrderButtonClickHandler(() => {
            const optionName = this._productPageComponent.getOptionTitleElement();
            const optionValue = this._productPageComponent.getActiveOptionElement();

            eventsForStore.addToCart({
                product,
                productPrice: productPrice.textContent,
                optionName: optionName ? optionName.textContent : undefined,
                optionValue: optionValue ? optionValue.textContent : undefined,
            });
            animationForAddProductToCart(this._productPageComponent.getElement());
        });

        const optionWrap = this._productPageComponent.getOptionWrapElement();

        if (optionWrap) {
            this._productPageComponent.setOptionItemClickHandler((event) => {
                const target = event.target;
                this._productPageComponent.deleteActiveClassOption(target);
                const optionName = target.textContent;
                // Находим цену опции
                const optionPrice = product.options.optionList.find(option => option[optionName]);
                productPrice.textContent = optionPrice.price;
            });
        }

        this._renderPrevBtn();
    }

    _renderPrevBtn() {
        this._btnPrevComponent = new BtnPrevComponent();
        render(this._container.getElement(), this._btnPrevComponent, RenderPosition.BEFOREEND);
        this._btnPrevComponent.setPrevBtnHandler(() => {
            eventsForStore.deleteLastMenuItem();
            let menu = $menu.getState();
            const id = menu[menu.length - 1].id;
            const name = menu[menu.length - 1].name;
            eventsForStore.findProductsInDefaultProductList({ id, name });
            eventsForStore.closeProductPage();
        });
    }

    _removeCartPage() {
        if (this._productPageComponent) {
            remove(this._productPageComponent);
            remove(this._btnPrevComponent);
        }
        eventsForStore.enabledSearch();
    }
}
