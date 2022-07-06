import AbstractComponent from "../../utils/abstarct-component";

const generateListBtn = `<div class="data-maker__right" id="content-0"></div>`;

export default class ContentComponent extends AbstractComponent {
    getTemplate() {
        return generateListBtn;
    }
}
