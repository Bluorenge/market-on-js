import AbstractComponent from "../../utils/abstract-component.js";

const createMenuItemTemplate = item => {
    return `<li id="menu-${item.id}" class="market-header__nav-item">${item.name}</li>`;
};

export default class MenuComponent extends AbstractComponent {
    constructor(items) {
        super();

        this._items = items;
    }

    getTemplate() {
        return createMenuItemTemplate(this._items);
    }

    setOpenButtonClickHandler(handler) {
        this.getElement().addEventListener(`click`, handler);
    }
}
