import { render, remove, RenderPosition } from "../../utils/render.js";

import CartIconComponent from "../components/cart-icon";
import CartPageComponent from "../components/cart-page";

import CartItemController from "./cart-item";

import { $cart } from "../../models/cart";
import { eventsForStore } from "../../models/eventsForStore";

const renderProducts = (container, setting, products) => {
    return products.map(item => {
        const productController = new CartItemController(container);
        productController.render(setting, item);
        return productController;
    });
};

export default class CartController {
    constructor(...args) {
        this._header = args[0];
        this._container = args[1];

        this._setting = args[2];

        this._cartIconComponent = null;
        this._cartPageComponent = null;

        this._showedCartProductsComponent = [];

        this._removeProduct = this._removeProduct.bind(this);
        this._changeTotalPrice = this._changeTotalPrice.bind(this);
    }

    render() {
        // Обновляем иконку корзины
        $cart.watch(state => this._updateIcon(state));
        // Обновляем страницу корзины при удалении товара
        $cart.watch(eventsForStore.deleteProductInCart, state => this._renderCartPage(state));
        $cart.watch(eventsForStore.updateQuantityOfProductInCart, state => this._changeTotalPrice(state));
        eventsForStore.openCartPage.watch(() => {
            eventsForStore.clearSearchInput();
            eventsForStore.disabledSearch();
            eventsForStore.createCartMenu();
            this._renderCartPage($cart.getState());
        });
        eventsForStore.closeCartPage.watch(() => {
            eventsForStore.enabledSearch();
            this._removeCartPage();
        });
    }

    _updateIcon(cartData) {
        if (this._cartIconComponent) {
            remove(this._cartIconComponent);
        }

        this._cartIconComponent = new CartIconComponent(cartData, this._setting);
        render(this._header.getElement(), this._cartIconComponent, RenderPosition.BEFOREEND);
        this._cartIconComponent.setProductCount();

        this._cartIconComponent.setOpenCartClickHandler(() => {
            eventsForStore.openCartPage();
        });
    }

    _renderCartPage(cartData) {
        if (this._cartPageComponent) {
            remove(this._cartPageComponent);
        }

        this._cartPageComponent = new CartPageComponent(cartData, this._setting);
        render(this._container.getElement(), this._cartPageComponent, RenderPosition.BEFOREEND);

        this._cartPageComponent.setToMainBtnOnClickHandler(() => {
            eventsForStore.toMainPageFromCart();
        });
        if (cartData.length > 0) {
            const newProducts = renderProducts(this._cartPageComponent.getElement(), this._setting, cartData);

            this._showedCartProductsComponent = this._showedCartProductsComponent.concat(newProducts);

            this._cartPageComponent.setMakeOrderBtnOnClickHandler(() => {
                const getOrderList = arr => {
                    let order = [];
                    arr.map(item => {
                        const product = {
                            name: item.name,
                            count: item.quantity,
                            price: item.price,
                        };
                        if (item.option !== undefined) {
                            product.optionName = item.option.optionName.replace(/:/, ``);
                            product.optionValue = item.option.optionValue;
                        }
                        return order.push(product);
                    });
                    return order;
                };
                const orderList = getOrderList($cart.getState());
                const totalPrice = orderList.reduce((priceAcc, product) => priceAcc + product.count * product.price, 0);
                // Коллбек на отправку заказа
                eventsForStore.sendOrder({ orderList, totalPrice });
            });
        }
    }

    _changeTotalPrice(cart) {
        const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString(`ru-RU`);
        this._cartPageComponent.getTotalPriceElement().textContent = totalPrice;
    }

    _removeProduct() {
        this._showedCartProductsComponent.forEach(productController => productController.destroy());
        this._showedCartProductsComponent = [];
    }

    _removeCartPage() {
        remove(this._cartPageComponent);
    }
}
