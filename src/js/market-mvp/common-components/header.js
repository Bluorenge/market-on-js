import AbstractComponent from "../utils/abstract-component";

const headerTemplate = `<header class="market-header"></header>`;

export default class HeaderComponent extends AbstractComponent {
    getTemplate() {
        return headerTemplate;
    }
}
