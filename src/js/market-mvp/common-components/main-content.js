import AbstractComponent from "../utils/abstract-component";

const createMarketContentTemplate = `<section class="market-content"></section>`;

export default class MainContentComponent extends AbstractComponent {
    getTemplate() {
        return createMarketContentTemplate;
    }
}
