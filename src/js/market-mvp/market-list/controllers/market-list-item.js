import { render, remove, replace, RenderPosition } from "../../utils/render.js";
import { eventsForStore } from "../../models/eventsForStore";
import { firstActiveOptionName, animationForAddProductToCart, isItProductInCart } from "../../utils/utils";

import ListItemComponent from "../components/market-list-item";
import { $cart } from "../../models/cart";
import { $productList, getContentViewType } from "../../models/products";

export default class ListItemController {
    constructor(container, setting, option) {
        this._container = container;
        this._setting = setting;
        this._option = option;

        this._productComponent = null;
    }

    render(product) {
        this._productComponent = new ListItemComponent(this._setting, this._option, product);
        render(this._container, this._productComponent, RenderPosition.BEFOREEND);
        this._initHandler(product);
    }

    destroy() {
        remove(this._productComponent);
    }

    getComponent() {
        return this._productComponent.getElement();
    }

    _initHandler(product) {
        const id = Number(this._productComponent.getElement().id.replace(/[^+\d]/g, ``));
        const name = this._productComponent.getItemNameElement().textContent;

        // При открытии элемента списка:
        this._productComponent.setOpenButtonClickHandler(() => {
            eventsForStore.clearSearchInput();
            eventsForStore.addMenuItem({ id, name });
            eventsForStore.changeProductListState({ id, name });

            const contentViewType = getContentViewType($productList.getState(), $productList.defaultState);

            if (contentViewType === "PRODUCT_PAGE") {
                eventsForStore.openProductPage();
            }
        });

        const isProduct = `price` in product;

        if (isProduct) {
            const productPrice = Number(
                this._productComponent.getProductPriceElement().textContent.replace(/[^+\d]/g, ``),
            );
            const productData = {
                product,
                productPrice,
                optionName: product.options?.nameOptionList,
                optionValue: product.options ? firstActiveOptionName(product.options.optionList) : undefined,
            };

            // Добавляем товар в корзину
            this._productComponent.setAddToCartBtnClickHandler(() => {
                if (!isItProductInCart($cart.getState(), product.name)) {
                    eventsForStore.addToCart(productData);
                    this._replace(product);
                    animationForAddProductToCart(this._productComponent.getElement());
                } else {
                    eventsForStore.addToCart(productData);
                    animationForAddProductToCart(this._productComponent.getElement());
                }
            });

            if (this._option.oneClickOrder && `options` in product == false) {
                this._productComponent.setOneClickOrderBtnClickHandler(() => {
                    eventsForStore.addToCart(productData);
                    if (!this._option.oneClickOrderCustom) {
                        eventsForStore.openCartPage();
                    } else {
                        eventsForStore.oneClickOrder({ productData });
                    }
                });
            }
        }
    }

    _replace(product) {
        const newViewOfListItem = new ListItemComponent(this._setting, this._option, product);
        replace(newViewOfListItem, this._productComponent);
        this._productComponent = newViewOfListItem;
        this._initHandler(product);
    }
}
