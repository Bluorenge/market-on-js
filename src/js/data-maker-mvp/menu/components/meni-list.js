import AbstractComponent from "../../utils/abstarct-component";

const menuListTemplate = `<ul class="data-maker__menu"></ul>`;

export default class MenuListComponent extends AbstractComponent {
    getTemplate() {
        return menuListTemplate;
    }
}
