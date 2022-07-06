import AbstractComponent from "../../utils/abstarct-component";

const menuAddCategoryTemplate = `<div class="data-maker__btn-add-wrap">
  <button class="data-maker__btn data-maker__btn--add-category">Добавить категорию</button>
  <button class="data-maker__btn data-maker__btn--add-product">Добавить товар</button>
</div>`;

export default class MenuAddItemsBtnComponent extends AbstractComponent {
    getTemplate() {
        return menuAddCategoryTemplate;
    }

    disableBtn(btn) {
        switch (btn) {
            case "category":
                this.getElement().querySelector(`.data-maker__btn--add-category`).disabled = true;
                break;
            case "product":
                this.getElement().querySelector(`.data-maker__btn--add-product`).disabled = true;
        }
    }

    enabledBtn() {
        this.getElement().querySelector(`.data-maker__btn--add-category`).disabled = false;
        this.getElement().querySelector(`.data-maker__btn--add-product`).disabled = false;
    }

    getAddCategoryBtn() {
        return this.getElement().querySelector(`.data-maker__btn--add-category`);
    }

    getAddProductBtn() {
        return this.getElement().querySelector(`.data-maker__btn--add-product`);
    }

    setAddMenuItemHandler(handler) {
        this.getAddCategoryBtn().addEventListener(`click`, handler);
        this.getAddProductBtn().addEventListener(`click`, handler);
    }
}
