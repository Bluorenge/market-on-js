import AbstractComponent from "../utils/abstarct-component";

const leftContentTemplate = `<div class="data-maker__left"></div>`;

export default class LeftContentComponent extends AbstractComponent {
    getTemplate() {
        return leftContentTemplate;
    }
}
