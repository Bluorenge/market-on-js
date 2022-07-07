import { render, remove, RenderPosition } from "../../utils/render";
import { elementReady } from "../../utils/utils";
import { carouselNav } from "../../utils/carousel&scrollbar";

import MenuComponent from "../components/menu";
import MenuItemComponent from "../components/menu-item";

import { eventsForStore } from "../../models/eventsForStore";
import { $menu, whatMenuIsIt } from "../../models/menu";

export default class MenuController {
    constructor(container) {
        this._container = container;

        this._menuComponent = new MenuComponent();
        this._menuItemComponents = [];

        this._onViewChange = this._onViewChange.bind(this);
    }

    render() {
        $menu.watch(menu => this._onViewChange(menu));
        // Подписываемся на очищение поля поиска
        eventsForStore.clearSearchInput.watch(() => {
            if (whatMenuIsIt($menu.getState(), `Поиск`)) {
                eventsForStore.deleteLastMenuItem();
            }
        });
    }

    _renderItem(menu) {
        const header = this._container.getElement();
        render(header, this._menuComponent, RenderPosition.BEFOREEND);
        const menuWrap = this._menuComponent.getElement();

        const renderMenuItems = arr => {
            return arr.map(element => {
                const menuItemComponent = new MenuItemComponent(element);
                render(menuWrap, menuItemComponent, RenderPosition.BEFOREEND);
                return menuItemComponent;
            });
        };
        this._menuItemComponents = renderMenuItems(menu);
        const isCartMenu =
            this._menuItemComponents[this._menuItemComponents.length - 1].getElement().textContent === `Корзина`;

        elementReady(header, `.${menuWrap.classList[0]}`).then(() => {
            const width = this._menuItemComponents.reduce((acc, item) => acc + item.getElement().offsetWidth, 0);
            carouselNav(menuWrap, width);
        });

        this._menuItemComponents.map((element, index) => {
            // Если это единственный элемент
            if (this._menuItemComponents.length === 1) {
                return "";
            }
            // Если это меню корзины и не последний элемент
            if (isCartMenu && index !== this._menuItemComponents.length - 1) {
                element.setOpenButtonClickHandler(() => {
                    eventsForStore.clearSearchInput();
                    eventsForStore.toMainPageFromCart();
                });
            }
            // Если это не последний элемент
            else if (index !== this._menuItemComponents.length - 1) {
                element.setOpenButtonClickHandler(() => {
                    const id = Number(element.getElement().id.replace(/[^+\d]/g, ``));
                    const name = element.getElement().textContent;

                    eventsForStore.clearSearchInput();
                    eventsForStore.closeProductPage();
                    eventsForStore.removeMenuItemsTo({ id, name });
                    eventsForStore.findProductsInDefaultProductList({ id, name });
                });
            }
        });
    }

    _onViewChange(menu) {
        if (this._menuItemComponents.length) {
            this._menuItemComponents.forEach(element => remove(element));
            this._menuItemComponents = [];
        }
        remove(this._menuComponent);
        this._renderItem(menu);
    }
}
